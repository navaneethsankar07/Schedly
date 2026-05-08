from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import (
    RegisterView, PostViewSet, GoogleLoginView, UserProfileView, NotificationViewSet,
    TemplateViewSet, AnalyticsView, ImproveCaptionView, TimeSuggestionView,
    ChangePasswordView, DeleteAccountView, GoalViewSet, WeeklyReportView
)

router = DefaultRouter()
router.register(r'posts', PostViewSet, basename='post')
router.register(r'notifications', NotificationViewSet, basename='notification')
router.register(r'templates', TemplateViewSet, basename='template')
router.register(r'goals', GoalViewSet, basename='goal')

urlpatterns = [
    path('register/', RegisterView.as_view(), name='auth_register'),
    path('auth/change-password/', ChangePasswordView.as_view(), name='change_password'),
    path('auth/delete-account/', DeleteAccountView.as_view(), name='delete_account'),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('google-login/', GoogleLoginView.as_view(), name='google_login'),
    path('user/profile/', UserProfileView.as_view(), name='user_profile'),
    path('analytics/', AnalyticsView.as_view(), name='analytics'),
    path('caption/improve/', ImproveCaptionView.as_view(), name='improve_caption'),
    path('suggestions/time/', TimeSuggestionView.as_view(), name='suggest_time'),
    path('reports/weekly/', WeeklyReportView.as_view(), name='weekly_report'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('', include(router.urls)),
]
