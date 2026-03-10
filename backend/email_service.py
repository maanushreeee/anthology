import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
from dotenv import load_dotenv

load_dotenv()

SMTP_EMAIL = os.getenv("SMTP_EMAIL")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")

def send_publish_email(to_email: str, username: str, article_title: str):
    if not to_email:
        return

    msg = MIMEMultipart()
    msg["From"] = SMTP_EMAIL
    msg["To"] = to_email
    msg["Subject"] = f"Your article '{article_title}' has been published!"

    body = f"""
Hi {username},

Your article "{article_title}" has been published on Anthology.

Happy writing!
— The Anthology Team
    """

    msg.attach(MIMEText(body, "plain"))

    try:
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(SMTP_EMAIL, SMTP_PASSWORD)
            server.sendmail(SMTP_EMAIL, to_email, msg.as_string())
            print(f"✅ Email sent to {to_email}")
    except Exception as e:
        print(f"❌ Email failed: {e}")