import os
from apscheduler.schedulers.background import BackgroundScheduler
from django.core.mail import send_mail
from django.utils import timezone
from datetime import timedelta


def _send_email(subject, plain_body, html_body, recipient_email):
    """Send email using Django's configured backend (SMTP or console)."""
    from django.core.mail import send_mail
    from django.conf import settings
    from_email = getattr(settings, 'DEFAULT_FROM_EMAIL', 'noreply@scheduler.com')
    try:
        send_mail(
            subject=subject,
            message=plain_body,
            from_email=from_email,
            recipient_list=[recipient_email],
            html_message=html_body,
            fail_silently=False,
        )
        print(f"[Email Success] Sent to {recipient_email}")
    except Exception as e:
        print(f"[Email Error] Could not send to {recipient_email}: {e}")
        raise


def _build_24h_html(username, scheduled_str, platform, preview, truncated):
    ellipsis = '...' if truncated else ''
    content_preview = f"{preview}{ellipsis}"
    
    return f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin:0; padding:0; background-color:#f4f4f5; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#f4f4f5; padding: 40px 20px;">
            <tr>
                <td align="center">
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color:#ffffff; border-radius:12px; overflow:hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
                        
                        <!-- Header -->
                        <tr>
                            <td style="background-color:#0f172a; padding: 30px 40px; text-align:center;">
                                <h1 style="color:#ffffff; margin:0; font-size:24px; font-weight:600; letter-spacing:0.5px;">Schedly App</h1>
                            </td>
                        </tr>
                        
                        <!-- Body -->
                        <tr>
                            <td style="padding: 40px;">
                                <h2 style="color:#0f172a; margin-top:0; margin-bottom:20px; font-size:20px;">🗓️ Upcoming Post Reminder</h2>
                                <p style="color:#475569; font-size:16px; line-height:24px; margin-top:0;">Hi <strong>{username}</strong>,</p>
                                <p style="color:#475569; font-size:16px; line-height:24px;">This is a quick heads-up that your scheduled social media post is due <strong>tomorrow</strong>.</p>
                                
                                <!-- Post Details Card -->
                                <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 30px 0; background-color:#f8fafc; border: 1px solid #e2e8f0; border-radius: 8px;">
                                    <tr>
                                        <td style="padding: 20px;">
                                            <p style="margin: 0 0 10px 0; font-size:14px; color:#64748b; text-transform:uppercase; letter-spacing:0.5px; font-weight:600;">Post Details</p>
                                            <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                                <tr>
                                                    <td style="padding:8px 0; width:100px; color:#64748b; font-size:15px;">Platform:</td>
                                                    <td style="padding:8px 0; color:#0f172a; font-weight:600; font-size:15px;">{platform}</td>
                                                </tr>
                                                <tr>
                                                    <td style="padding:8px 0; width:100px; color:#64748b; font-size:15px;">Scheduled:</td>
                                                    <td style="padding:8px 0; color:#0f172a; font-weight:600; font-size:15px;">{scheduled_str}</td>
                                                </tr>
                                                <tr>
                                                    <td style="padding:8px 0; width:100px; color:#64748b; font-size:15px; vertical-align:top;">Preview:</td>
                                                    <td style="padding:8px 0; color:#475569; font-size:15px; font-style:italic; line-height:1.4;">&ldquo;{content_preview}&rdquo;</td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                                
                                <p style="color:#475569; font-size:16px; line-height:24px; margin-bottom:30px;">Please log in to your dashboard if you need to review or make any final edits before the publishing deadline.</p>
                                
                                <!-- Button -->
                                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                    <tr>
                                        <td align="center">
                                            <a href="#" style="background-color:#3b82f6; color:#ffffff; display:inline-block; padding:14px 28px; text-decoration:none; border-radius:6px; font-weight:600; font-size:16px; text-align:center;">Review Dashboard</a>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                        
                        <!-- Footer -->
                        <tr>
                            <td style="background-color:#f8fafc; padding: 24px 40px; text-align:center; border-top: 1px solid #e2e8f0;">
                                <p style="color:#94a3b8; font-size:13px; margin:0;">You are receiving this because you scheduled a post via Schedly App.</p>
                            </td>
                        </tr>
                        
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    """


def _build_due_html(username, scheduled_str, platform, content):
    return f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin:0; padding:0; background-color:#f4f4f5; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#f4f4f5; padding: 40px 20px;">
            <tr>
                <td align="center">
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color:#ffffff; border-radius:12px; overflow:hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
                        
                        <!-- Header -->
                        <tr>
                            <td style="background-color:#dc2626; padding: 30px 40px; text-align:center;">
                                <h1 style="color:#ffffff; margin:0; font-size:24px; font-weight:600; letter-spacing:0.5px;">Action Required</h1>
                            </td>
                        </tr>
                        
                        <!-- Body -->
                        <tr>
                            <td style="padding: 40px;">
                                <h2 style="color:#0f172a; margin-top:0; margin-bottom:20px; font-size:20px;">🚀 It's time to publish!</h2>
                                <p style="color:#475569; font-size:16px; line-height:24px; margin-top:0;">Hi <strong>{username}</strong>,</p>
                                <p style="color:#475569; font-size:16px; line-height:24px;">The scheduled time for your <strong>{platform}</strong> post has arrived. It's time to get it out into the world!</p>
                                
                                <!-- Meta Info -->
                                <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 20px 0;">
                                    <tr>
                                        <td style="padding:8px 0; width:100px; color:#64748b; font-size:15px;">Platform:</td>
                                        <td style="padding:8px 0; color:#0f172a; font-weight:600; font-size:15px;">{platform}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding:8px 0; width:100px; color:#64748b; font-size:15px;">Scheduled:</td>
                                        <td style="padding:8px 0; color:#0f172a; font-weight:600; font-size:15px;">{scheduled_str}</td>
                                    </tr>
                                </table>
                                
                                <!-- Content Block (Preserves Whitespace) -->
                                <div style="margin: 30px 0; background-color:#fef2f2; border: 1px solid #fca5a5; border-left: 4px solid #ef4444; border-radius: 6px; padding: 20px;">
                                    <p style="margin: 0 0 10px 0; font-size:13px; color:#dc2626; text-transform:uppercase; letter-spacing:0.5px; font-weight:700;">Post Content</p>
                                    <p style="margin:0; color:#0f172a; font-size:15px; line-height:1.6; white-space:pre-wrap; font-family: ui-sans-serif, system-ui, -apple-system, sans-serif;">{content}</p>
                                </div>
                                
                                <p style="color:#475569; font-size:16px; line-height:24px; margin-bottom:30px;">Once you have published this content to {platform}, please log in to your dashboard to mark this post as completed.</p>
                                
                                <!-- Button -->
                                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                    <tr>
                                        <td align="center">
                                            <a href="http://localhost:5173/dashboard" style="background-color:#ef4444; color:#ffffff; display:inline-block; padding:14px 28px; text-decoration:none; border-radius:6px; font-weight:600; font-size:16px; text-align:center;">Mark as Posted</a>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                        
                        <!-- Footer -->
                        <tr>
                            <td style="background-color:#f8fafc; padding: 24px 40px; text-align:center; border-top: 1px solid #e2e8f0;">
                                <p style="color:#94a3b8; font-size:13px; margin:0;">You are receiving this because you scheduled a post via Schedly.</p>
                            </td>
                        </tr>
                        
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    """


def check_notifications():
    from .models import Post, Notification

    now = timezone.now()

    # ── 1. TEST MODE: reminder for posts due within next 5 minutes ────────────
    # TODO: Revert to 24-hour window after testing:
    #   tomorrow_start = now + timedelta(hours=23, minutes=59)
    #   tomorrow_end   = now + timedelta(hours=24, minutes=1)
    tomorrow_start = now
    tomorrow_end   = now + timedelta(seconds=1)

    upcoming_posts = Post.objects.filter(
        status='scheduled',
        notified_24h=False,
        scheduled_time__gte=tomorrow_start,
        scheduled_time__lte=tomorrow_end,
    )

    for post in upcoming_posts:
        email = post.user.email
        if not email:
            continue

        scheduled_str = post.scheduled_time.strftime("%B %d, %Y at %I:%M %p UTC")
        preview = post.content[:80]
        truncated = len(post.content) > 80

        try:
            Notification.objects.create(
                user=post.user,
                message=(
                    "[TEST] Reminder: Your post on " + post.platform + " is due at "
                    + post.scheduled_time.strftime("%I:%M %p UTC") + "."
                ),
            )
            
            # Save state immediately so we don't spam notifications if email fails
            post.notified_24h = True
            post.save(update_fields=['notified_24h'])

            plain = (
                "Hi " + post.user.username + ",\n\n"
                "This is a reminder that your scheduled post is due tomorrow.\n\n"
                "Scheduled for: " + scheduled_str + "\n"
                "Platform: " + post.platform + "\n"
                "Preview: \"" + preview + ("..." if truncated else "") + "\"\n\n"
                "Log in to your Schedly dashboard to review or update your post.\n\n"
                "-- Schedly App"
            )

            try:
                _send_email(
                    subject='[TEST] Reminder: Your scheduled post is coming up soon',
                    plain_body=plain,
                    html_body=_build_24h_html(
                        post.user.username, scheduled_str, post.platform, preview, truncated
                    ),
                    recipient_email=email,
                )
            except Exception as e:
                pass  # Error is already printed by _send_email

        except Exception as e:
            print(f"[Notification Error] 24h reminder for post {post.id}: {e}")

    # ── 2. Due notification (fires after post is ≥1 min overdue) ─────────────
    due_start = now - timedelta(hours=24)   # wide window so no post is ever missed
    due_end   = now - timedelta(minutes=1)  # must be at least 1 minute overdue

    due_posts = Post.objects.filter(
        status='scheduled',
        notified_due=False,
        scheduled_time__gte=due_start,
        scheduled_time__lte=due_end,
    )

    for post in due_posts:
        email = post.user.email
        if not email:
            continue

        scheduled_str = post.scheduled_time.strftime("%B %d, %Y at %I:%M %p UTC")

        try:
            Notification.objects.create(
                user=post.user,
                message=(
                    "It's time! Your post on " + post.platform
                    + " is due now. Log in to mark it as posted."
                ),
            )
            
            # Save state immediately so we don't spam notifications if email fails
            post.notified_due = True
            post.save(update_fields=['notified_due'])

            plain = (
                "Hi " + post.user.username + ",\n\n"
                "It's time to post your scheduled content!\n\n"
                "Was scheduled for: " + scheduled_str + "\n"
                "Platform: " + post.platform + "\n"
                "Content:\n\"" + post.content + "\"\n\n"
                "Log in to your dashboard and mark it as posted.\n\n"
                "-- Schedly App"
            )

            try:
                _send_email(
                    subject='Action Required: Your post is due NOW!',
                    plain_body=plain,
                    html_body=_build_due_html(
                        post.user.username, scheduled_str, post.platform, post.content
                    ),
                    recipient_email=email,
                )
            except Exception as e:
                pass  # Error is already printed by _send_email

        except Exception as e:
            print(f"[Notification Error] Due notification for post {post.id}: {e}")


def start():
    # Prevent APScheduler running twice under Django's auto-reloader
    if os.environ.get('RUN_MAIN', None) != 'true':
        scheduler = BackgroundScheduler()
        scheduler.add_job(check_notifications, 'interval', seconds=60)
        scheduler.start()
        print("[Schedly] Background job started - checking every 60 seconds.")
