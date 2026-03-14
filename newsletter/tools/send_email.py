"""
Tool: send_email.py
Purpose: Send an HTML newsletter email via Gmail API with an inline header image
Input:  --topic (str), --html (str or @file path), --image (file path), --edition (int)
Output: Sends email, prints success/failure
Usage:  python tools/send_email.py --topic "AI" --html @.tmp/newsletter.html --image .tmp/newsletter_image.png --edition 1
"""

import os
import sys
import argparse
import base64
from pathlib import Path
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.image import MIMEImage
from dotenv import load_dotenv

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build


load_dotenv()

RECIPIENT_EMAIL = os.getenv("RECIPIENT_EMAIL")
SENDER_EMAIL = os.getenv("SENDER_EMAIL")

SCOPES = ["https://www.googleapis.com/auth/gmail.send"]
CREDENTIALS_PATH = Path(__file__).parent.parent / "credentials.json"
TOKEN_PATH = Path(__file__).parent.parent / "token.json"


def get_gmail_service():
    """Authenticate and return Gmail API service."""
    creds = None

    if TOKEN_PATH.exists():
        creds = Credentials.from_authorized_user_file(str(TOKEN_PATH), SCOPES)

    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(
                str(CREDENTIALS_PATH), SCOPES
            )
            creds = flow.run_local_server(port=0)
        with open(TOKEN_PATH, "w") as token:
            token.write(creds.to_json())

    return build("gmail", "v1", credentials=creds)


def build_email(topic: str, html_body: str, image_path: str, edition: int) -> str:
    """Build a MIME multipart email with an inline image and HTML body."""
    msg = MIMEMultipart("related")
    msg["Subject"] = f"📰 {topic} — Edition #{edition}"
    msg["From"] = SENDER_EMAIL
    msg["To"] = RECIPIENT_EMAIL

    # Replace image placeholder with inline CID reference
    html_with_image = html_body.replace(
        "<!-- IMAGE_PLACEHOLDER -->",
        '<img src="cid:newsletter_header" alt="Newsletter Image" style="width:100%;max-width:600px;display:block;margin:0 auto 24px auto;border-radius:8px;">'
    )

    # Wrap in full HTML document
    full_html = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{topic} — Edition #{edition}</title>
</head>
<body style="margin:0;padding:0;background-color:#f1f5f9;font-family:'Segoe UI',Arial,sans-serif;">
  <div style="max-width:600px;margin:32px auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
    {html_with_image}
  </div>
</body>
</html>"""

    alt = MIMEMultipart("alternative")
    alt.attach(MIMEText(full_html, "html"))
    msg.attach(alt)

    # Attach inline image
    if image_path and Path(image_path).exists():
        with open(image_path, "rb") as img_file:
            img = MIMEImage(img_file.read())
            img.add_header("Content-ID", "<newsletter_header>")
            img.add_header("Content-Disposition", "inline", filename="header.png")
            msg.attach(img)

    raw = base64.urlsafe_b64encode(msg.as_bytes()).decode("utf-8")
    return raw


def send_email(topic: str, html_body: str, image_path: str, edition: int):
    """Send the newsletter email via Gmail API."""
    print(f"[send_email] Sending Edition #{edition} to {RECIPIENT_EMAIL}...")

    try:
        service = get_gmail_service()
        raw_message = build_email(topic, html_body, image_path, edition)
        result = service.users().messages().send(
            userId="me",
            body={"raw": raw_message}
        ).execute()
        print(f"[send_email] ✅ Sent! Message ID: {result['id']}")
    except Exception as e:
        print(f"ERROR sending email: {e}")
        sys.exit(1)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Send newsletter email via Gmail")
    parser.add_argument("--topic", required=True)
    parser.add_argument("--html", required=True, help="HTML string or @filepath")
    parser.add_argument("--image", required=True, help="Path to header image")
    parser.add_argument("--edition", type=int, default=1)
    args = parser.parse_args()

    # Support @filepath
    if args.html.startswith("@"):
        html_body = Path(args.html[1:]).read_text(encoding="utf-8")
    else:
        html_body = args.html

    send_email(args.topic, html_body, args.image, args.edition)
