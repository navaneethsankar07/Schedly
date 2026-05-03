from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import RegisterView, PostViewSet, GoogleLoginView, UserProfileView, NotificationViewSet, TemplateViewSet, AnalyticsView

router = DefaultRouter()
router.register(r'posts', PostViewSet, basename='post')
router.register(r'notifications', NotificationViewSet, basename='notification')
router.register(r'templates', TemplateViewSet, basename='template')

urlpatterns = [
    path('register/', RegisterView.as_view(), name='auth_register'),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('google-login/', GoogleLoginView.as_view(), name='google_login'),
    path('user/profile/', UserProfileView.as_view(), name='user_profile'),
    path('analytics/', AnalyticsView.as_view(), name='analytics'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('', include(router.urls)),
]
