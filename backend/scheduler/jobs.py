import os
from apscheduler.schedulers.background import BackgroundScheduler
from django.core.mail import send_mail
from django.utils import timezone
from datetime import timedelta

def check_notifications():
    from .models import Post, Notification
    
    # Ensure it only runs once per cycle
    # Wait, we configure this to run every minute
    now = timezone.now()
    
    # 1. Notify exactly ~1 day before (within the next minute window assuming 60s cron interval)
    # We look for posts scheduled between 23h59m and 24h00m from now that are NOT notified
    tomorrow_start = now + timedelta(days=1) - timedelta(minutes=1)
    tomorrow_end = now + timedelta(days=1) + timedelta(minutes=1)
    
    upcoming_posts = Post.objects.filter(
        status='scheduled',
        notified_24h=False,
        scheduled_time__gte=tomorrow_start,
        scheduled_time__lte=tomorrow_end
    )
    
    for post in upcoming_posts:
        email = post.user.email
        if email:
            try:
                Notification.objects.create(
                    user=post.user,
                    message=f"Upcoming Post Reminder: 1 Day Left for your post '{post.content[:30]}...'"
                )
                send_mail(
                    subject='Upcoming Post Reminder: 1 Day Left',
                    message=f'Hello! This is a reminder that your scheduled post is due tomorrow at {post.scheduled_time.strftime("%I:%M %p")}.\n\nPreview: "{post.content[:50]}..."',
                    from_email='noreply@scheduler.com',
                    recipient_list=[email],
                    fail_silently=False,
                )
                post.notified_24h = True
                post.save(update_fields=['notified_24h'])
            except Exception as e:
                print(f"Email failed for post {post.id}:", e)

    # 2. Notify when it is DUE
    due_start = now - timedelta(minutes=5)
    due_end = now
    
    # If the scheduled time is immediately passed (in the last 5 mins), send it
    due_posts = Post.objects.filter(
        status='scheduled',
        notified_due=False,
        scheduled_time__gte=due_start,
        scheduled_time__lte=due_end
    )
    
    for post in due_posts:
        email = post.user.email
        if email:
            try:
                Notification.objects.create(
                    user=post.user,
                    message=f"Action Required: It is time to post your scheduled content '{post.content[:30]}...'"
                )
                send_mail(
                    subject='Action Required: Post Time Reached',
                    message=f'Hello! It is time to post your scheduled content.\n\nContent: "{post.content}"\n\nLogin to the dashboard to mark it as published.',
                    from_email='noreply@scheduler.com',
                    recipient_list=[email],
                    fail_silently=False,
                )
                post.notified_due = True
                post.save(update_fields=['notified_due'])
            except Exception as e:
                print(f"Email failed for post {post.id}:", e)

def start():
    # To prevent APScheduler from running twice in dev (because of auto-reloader)
    # Only start the scheduler in the main thread process. 
    if os.environ.get('RUN_MAIN', None) != 'true':
        scheduler = BackgroundScheduler()
        # Run every 60 seconds
        scheduler.add_job(check_notifications, 'interval', seconds=60)
        scheduler.start()
