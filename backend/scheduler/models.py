from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    connected_platforms = models.JSONField(default=list, blank=True)

    def __str__(self):
        return self.user.username

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)

class Post(models.Model):
    STATUS_CHOICES = (
        ('scheduled', 'Scheduled'),
        ('posted', 'Posted'),
    )
    PLATFORM_CHOICES = (
        ('General', 'General'),
        ('X', 'X'),
        ('LinkedIn', 'LinkedIn'),
        ('Instagram', 'Instagram'),
        ('Facebook', 'Facebook'),
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='posts')
    content = models.TextField()
    platform = models.CharField(max_length=50, choices=PLATFORM_CHOICES, default='General')
    username = models.CharField(max_length=255, blank=True, default='your_username')
    image = models.ImageField(upload_to='posts/', null=True, blank=True)
    scheduled_time = models.DateTimeField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='scheduled')
    notified_24h = models.BooleanField(default=False)
    notified_due = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.user.username} - {self.platform} - {self.status}'

class Notification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Notification for {self.user.username}: {self.message[:20]}"

class Template(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='templates')
    title = models.CharField(max_length=255)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title
