from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Post, Profile, Notification, Template, Goal
from django.utils import timezone

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ('connected_platforms',)

class UserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(read_only=True)
    login_method = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'profile', 'login_method')

    def get_login_method(self, obj):
        return 'password' if obj.has_usable_password() else 'google'

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('id', 'email', 'password')

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['email'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user

class PostSerializer(serializers.ModelSerializer):
    # Read-only helper so the frontend can know whether editing is allowed
    is_past_due = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = '__all__'
        read_only_fields = ('user', 'created_at', 'updated_at')

    def get_is_past_due(self, obj):
        return obj.scheduled_time <= timezone.now()

    def validate_scheduled_time(self, value):
        # On CREATE: time must be in the future
        if self.instance is None and value <= timezone.now():
            raise serializers.ValidationError("Scheduled time must be in the future.")
        return value

    def validate(self, data):
        # On UPDATE: block edits if the scheduled time has already passed
        if self.instance is not None:
            current_scheduled = data.get('scheduled_time', self.instance.scheduled_time)
            if self.instance.scheduled_time <= timezone.now():
                raise serializers.ValidationError(
                    "This post cannot be edited because its scheduled time has already passed."
                )
            # If they're changing the scheduled time, the new value must also be in the future
            if 'scheduled_time' in data and data['scheduled_time'] <= timezone.now():
                raise serializers.ValidationError(
                    {"scheduled_time": "Scheduled time must be in the future."}
                )
        return data

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['id', 'user', 'message', 'is_read', 'created_at']
        read_only_fields = ['id', 'user', 'created_at']

class TemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Template
        fields = ['id', 'title', 'content', 'created_at']
        read_only_fields = ['id', 'created_at']

class GoalSerializer(serializers.ModelSerializer):
    progress_count = serializers.SerializerMethodField()
    progress_pct = serializers.SerializerMethodField()

    class Meta:
        model = Goal
        fields = ['id', 'target_posts', 'timeframe', 'created_at', 'progress_count', 'progress_pct']
        read_only_fields = ['id', 'created_at']

    def _get_window_start(self, timeframe):
        from django.utils import timezone
        from datetime import timedelta
        now = timezone.now()
        if timeframe == 'weekly':
            return now - timedelta(days=7)
        return now - timedelta(days=30)

    def get_progress_count(self, obj):
        start = self._get_window_start(obj.timeframe)
        return obj.user.posts.filter(status='posted', updated_at__gte=start).count()

    def get_progress_pct(self, obj):
        count = self.get_progress_count(obj)
        if obj.target_posts == 0:
            return 0
        return min(round((count / obj.target_posts) * 100), 100)
