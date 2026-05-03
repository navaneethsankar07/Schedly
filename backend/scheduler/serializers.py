from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Post, Profile, Notification
from django.utils import timezone

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ('connected_platforms',)

class UserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(read_only=True)
    
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'profile')

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
