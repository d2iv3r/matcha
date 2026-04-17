"""Mail delivery helpers."""

import logging
import smtplib
from email.message import EmailMessage
from typing import Optional

from flask import current_app


logger = logging.getLogger(__name__)


class MailService:
    """SMTP-based mail delivery service."""

    @staticmethod
    def _mail_config() -> dict:
        return {
            "server": current_app.config.get("MAIL_HOST"),
            "port": current_app.config.get("MAIL_PORT", 587),
            "user": current_app.config.get("MAIL_USER"),
            "password": current_app.config.get("MAIL_PASSWORD"),
            "use_tls": current_app.config.get("MAIL_USE_TLS", True),
            "use_ssl": current_app.config.get("MAIL_USE_SSL", False),
            "default_sender": current_app.config.get("MAIL_DEFAULT_SENDER"),
            "frontend_url": current_app.config.get("FRONTEND_URL", "http://localhost:3000"),
            "backend_url": current_app.config.get("BACKEND_URL", "http://localhost:5000"),
        }

    @staticmethod
    def send_email(subject: str, recipient: str, text_body: str, html_body: Optional[str] = None) -> bool:
        config = MailService._mail_config()

        if not config["server"]:
            logger.warning("[MAIL] MAIL_SERVER is not configured; skipping email send to %s", recipient)
            return False

        message = EmailMessage()
        message["Subject"] = subject
        message["From"] = config["user"] or "no-reply@localhost"
        message["To"] = recipient
        message.set_content(text_body)

        if html_body:
            message.add_alternative(html_body, subtype="html")

        try:
            if config["use_ssl"]:
                with smtplib.SMTP_SSL(config["server"], config["port"], timeout=15) as smtp:
                    if config["user"] and config["password"]:
                        smtp.login(config["user"], config["password"])
                    smtp.send_message(message)
            else:
                with smtplib.SMTP(config["server"], config["port"], timeout=15) as smtp:
                    if config["use_tls"]:
                        smtp.starttls()
                    if config["user"] and config["password"]:
                        smtp.login(config["user"], config["password"])
                    smtp.send_message(message)

            logger.info("[MAIL] Email sent to %s", recipient)
            return True
        except Exception as exc:
            logger.error("[MAIL] Failed to send email to %s: %s", recipient, exc)
            return False

    @staticmethod
    def send_verification_email(recipient: str, username: str, token: str) -> bool:
        config = MailService._mail_config()
        verification_url = f"{config['backend_url'].rstrip('/')}/api/auth/verify-email?token={token}"

        subject = "Verify your account"
        text_body = (
            f"Hi {username},\n\n"
            f"Thanks for registering. Verify your account using this link:\n{verification_url}\n\n"
            "If you did not create this account, you can ignore this email."
        )
        html_body = f"""
        <html>
          <body>
            <p>Hi {username},</p>
            <p>Thanks for registering. Please verify your account by clicking the link below:</p>
            <p><a href=\"{verification_url}\">Verify my account</a></p>
            <p>If you did not create this account, you can ignore this email.</p>
          </body>
        </html>
        """

        return MailService.send_email(subject, recipient, text_body, html_body)

    @staticmethod
    def send_password_reset_email(recipient: str, username: str, token: str) -> bool:
        config = MailService._mail_config()
        reset_url = f"{config['frontend_url'].rstrip('/')}/reset-password?token={token}"

        subject = "Reset your password"
        text_body = (
            f"Hi {username},\n\n"
            "We received a request to reset your password. Use this link to continue:\n"
            f"{reset_url}\n\n"
            "If you did not request a password reset, you can ignore this email."
        )
        html_body = f"""
        <html>
          <body>
            <p>Hi {username},</p>
            <p>We received a request to reset your password. Click the link below to continue:</p>
            <p><a href=\"{reset_url}\">Reset my password</a></p>
            <p>If you did not request a password reset, you can ignore this email.</p>
          </body>
        </html>
        """

        return MailService.send_email(subject, recipient, text_body, html_body)