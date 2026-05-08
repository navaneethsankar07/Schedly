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
from .models import Post, Profile, Notification, Template, Goal
from .serializers import RegisterSerializer, PostSerializer, UserSerializer, NotificationSerializer, TemplateSerializer, GoalSerializer

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

    @action(detail=True, methods=['patch'], url_path='update-stage')
    def update_stage(self, request, pk=None):
        post = self.get_object()
        stage = request.data.get('workflow_stage')
        if stage not in ['ideas', 'drafting', 'ready', 'scheduled', 'posted']:
            return Response({'error': 'Invalid stage'}, status=status.HTTP_400_BAD_REQUEST)
        post.workflow_stage = stage
        post.save(update_fields=['workflow_stage'])
        return Response({'workflow_stage': post.workflow_stage})

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

class ImproveCaptionView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        content = request.data.get('content', '')
        if not content:
            return Response({'improved_content': ''})

        # Feature: Use free AI (Pollinations) to improve caption
        try:
            import requests
            import urllib.parse
            prompt = f"Improve this social media caption explicitly by keeping the tone engaging and adding relevant emojis and hashtags. Do not output anything other than the final improved caption (no commentary, no conversational text). The original caption is: {content}"
            encoded_prompt = urllib.parse.quote(prompt)
            url = f"https://text.pollinations.ai/prompt/{encoded_prompt}"
            
            response = requests.get(url, timeout=15)
            if response.status_code == 200:
                improved_content = response.text.strip()
                if improved_content and len(improved_content) > 5 and "Here are" not in improved_content:
                    return Response({'improved_content': improved_content})
        except Exception as e:
            print("Failed to use AI fallback to manual:", e)

        # Fallback heuristic
        emoji_map = {
            'excited': '🤩', 'happy': '😊', 'sad': '😢', 'love': '❤️', 'tech': '💻', 
            'coding': '👨‍💻', 'new': '✨', 'update': '🚀', 'design': '🎨', 'coffee': '☕',
            'great': '🌟', 'awesome': '🔥', 'congrats': '🎉', 'time': '⏳', 'idea': '💡'
        }
        
        stopwords = {"the", "is", "at", "which", "and", "on", "in", "to", "a", "an", "for", "with", "about", "as", "by", "this", "my", "today", "of", "it", "that", "are", "you", "we", "they", "i", "just", "so", "be", "or"}
        hashtag_dict = {
            "fitness": ["#fitness", "#workout", "#health"],
            "coding": ["#coding", "#developer", "#programming"],
            "business": ["#startup", "#entrepreneur", "#business"],
            "study": ["#study", "#learning", "#student"],
            "travel": ["#travel", "#explore", "#wanderlust"]
        }
        
        words = content.split()
        improved_words = []
        clean_words = []
        
        import re
        for word in words:
            clean_word = word.lower().strip(',.!?')
            improved_words.append(word)
            if clean_word in emoji_map:
                improved_words.append(emoji_map[clean_word])
                
            cleaned_alpha = re.sub(r'[^a-z]', '', clean_word)
            if cleaned_alpha and cleaned_alpha not in stopwords and len(cleaned_alpha) > 2:
                clean_words.append(cleaned_alpha)
                
        collected_hashtags = []
        for cw in clean_words:
            for key, tags in hashtag_dict.items():
                if key in cw or cw in key:
                    collected_hashtags.extend(tags)
                    
        # Remove duplicates while preserving order
        collected_hashtags = list(dict.fromkeys(collected_hashtags))
        
        if not collected_hashtags:
            collected_hashtags = ["#daily", "#updates", "#community", "#journey", "#growth", "#vibes"]
            
        collected_hashtags = collected_hashtags[:8]
                
        improved_content = ' '.join(improved_words)
        improved_content = improved_content.replace('. ', '.\n\n')
        improved_content += f"\n\n{' '.join(collected_hashtags)}"
        
        return Response({'improved_content': improved_content})

class TimeSuggestionView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response([
            "09:00",
            "13:00",
            "18:00",
            "21:00"
        ])

class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        if not user.has_usable_password():
            return Response({'error': 'Password change not available for Google-authenticated users'}, status=status.HTTP_400_BAD_REQUEST)
        
        old_password = request.data.get('old_password')
        new_password = request.data.get('new_password')
        
        if not old_password or not new_password:
            return Response({'error': 'old_password and new_password are required'}, status=status.HTTP_400_BAD_REQUEST)
            
        if not user.check_password(old_password):
            return Response({'error': 'Incorrect old password'}, status=status.HTTP_400_BAD_REQUEST)
            
        if len(new_password) < 8:
            return Response({'error': 'New password must be at least 8 characters long'}, status=status.HTTP_400_BAD_REQUEST)
            
        user.set_password(new_password)
        user.save()
        return Response({'message': 'Password changed successfully'})

class DeleteAccountView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        request.user.delete()
        return Response({'message': 'Account deleted successfully'}, status=status.HTTP_204_NO_CONTENT)

class GoalViewSet(viewsets.ModelViewSet):
    serializer_class = GoalSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Goal.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class WeeklyReportView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        from django.utils import timezone
        from datetime import timedelta, timedelta
        from collections import Counter

        now = timezone.now()
        week_start = now - timedelta(days=7)
        posts = request.user.posts.all()
        week_posts = posts.filter(created_at__gte=week_start)
        posted_posts = posts.filter(status='posted', updated_at__gte=week_start)

        # Top platform
        platforms = list(week_posts.values_list('platform', flat=True))
        top_platform = Counter(platforms).most_common(1)[0][0] if platforms else 'None'

        # Most active day
        days = [p.created_at.strftime('%A') for p in week_posts]
        most_active_day = Counter(days).most_common(1)[0][0] if days else 'None'

        # Streak
        streak = 0
        check_date = now.date()
        while True:
            if posts.filter(status='posted', updated_at__date=check_date).exists():
                streak += 1
                check_date -= timedelta(days=1)
            else:
                break

        # Daily breakdown for chart (last 7 days)
        daily_breakdown = []
        for i in range(6, -1, -1):
            day = now - timedelta(days=i)
            day_label = day.strftime('%a')
            count = week_posts.filter(created_at__date=day.date()).count()
            daily_breakdown.append({'day': day_label, 'posts': count})

        # Insights
        posted_count = posted_posts.count()
        total_count = week_posts.count()
        insights = []
        if posted_count > 0:
            insights.append(f"You posted {posted_count} time{'s' if posted_count != 1 else ''} this week 🎉")
        if top_platform != 'None' and platforms:
            insights.append(f"{top_platform} was your most active platform 📱")
        if streak > 1:
            insights.append(f"You're on a {streak}-day posting streak 🔥")
        if most_active_day != 'None' and days:
            insights.append(f"{most_active_day} is your most productive day 📅")
        if not insights:
            insights.append("Start posting to generate your first insights! 🚀")

        # Productivity score (0-100)
        score = min(100, round((posted_count / 7) * 100))

        return Response({
            'total_posts': total_count,
            'posted_count': posted_count,
            'top_platform': top_platform,
            'most_active_day': most_active_day,
            'streak': streak,
            'productivity_score': score,
            'daily_breakdown': daily_breakdown,
            'insights': insights,
        })
