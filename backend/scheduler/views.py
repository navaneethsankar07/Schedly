from rest_framework import generics, viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from django.conf import settings
from django.contrib.auth.models import User
from .models import Post, Profile, Notification, Template
from .serializers import RegisterSerializer, PostSerializer, UserSerializer, NotificationSerializer, TemplateSerializer

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer

class PostViewSet(viewsets.ModelViewSet):
    serializer_class = PostSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        queryset = Post.objects.filter(user=self.request.user).order_by('scheduled_time')
        category = self.request.query_params.get('category')
        if category and category.lower() != 'all':
            queryset = queryset.filter(platform__iexact=category)
        return queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['patch'], url_path='mark-posted')
    def mark_posted(self, request, pk=None):
        post = self.get_object()
        post.status = 'posted'
        post.save()
        return Response({'status': 'marked as posted'})

class GoogleLoginView(APIView):
    permission_classes = (AllowAny,)

    def post(self, request):
        token = request.data.get('token')
        if not token:
            return Response({'error': 'Token is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            client_id = getattr(settings, 'GOOGLE_OAUTH_CLIENT_ID', 'placeholder')
            idinfo = id_token.verify_oauth2_token(
                token, google_requests.Request(), 
                # Bypass client ID validation if placeholder
                audience=client_id if client_id != 'placeholder' else None
            )
            
            email = idinfo['email']
            user, created = User.objects.get_or_create(email=email, defaults={
                'username': email,
            })
            if created:
                user.set_unusable_password()
                user.save()
                
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            })
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        serializer = UserSerializer(user)
        return Response(serializer.data)

    def put(self, request):
        user = request.user
        username = request.data.get('username')
        connected_platforms = request.data.get('connected_platforms')

        if username:
            user.username = username
            user.save()
            
        if connected_platforms is not None:
            profile = user.profile
            profile.connected_platforms = connected_platforms
            profile.save()

        return Response(UserSerializer(user).data)

class NotificationViewSet(viewsets.ModelViewSet):
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return self.request.user.notifications.all().order_by('-created_at')

    @action(detail=True, methods=['patch'], url_path='mark-read')
    def mark_read(self, request, pk=None):
        notification = self.get_object()
        notification.is_read = True
        notification.save(update_fields=['is_read'])
        return Response({'status': 'marked as read'})

    @action(detail=False, methods=['post'], url_path='mark-all-read')
    def mark_all_read(self, request):
        self.get_queryset().update(is_read=True)
        return Response({'status': 'all marked as read'})

class TemplateViewSet(viewsets.ModelViewSet):
    serializer_class = TemplateSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Template.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

from datetime import timedelta
from django.utils import timezone

class AnalyticsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        posts = Post.objects.filter(user=user)
        total_posts = posts.count()
        scheduled_posts = posts.filter(status='scheduled').count()
        posted_posts = posts.filter(status='posted').count()

        posted_dates = set(
            p.scheduled_time.date() for p in posts.filter(status='posted')
        )
        
        streak = 0
        current_date = timezone.now().date()
        
        if current_date in posted_dates:
            check_date = current_date
        elif (current_date - timedelta(days=1)) in posted_dates:
            check_date = current_date - timedelta(days=1)
        else:
            check_date = None
            
        if check_date:
            while check_date in posted_dates:
                streak += 1
                check_date -= timedelta(days=1)

        return Response({
            'total_posts': total_posts,
            'scheduled_posts': scheduled_posts,
            'posted_posts': posted_posts,
            'current_streak': streak
        })
