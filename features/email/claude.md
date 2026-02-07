
### Email

- **Provider**: Mailjet for transactional emails
- **Service**: `apps/api/src/services/email.ts` — `sendEmail({ to, subject, html })`
- **Config**: `MAILJET_API_KEY`, `MAILJET_SECRET_KEY`, `MAILJET_SENDER_EMAIL`
- **Graceful fallback**: Logs to console if credentials not set (dev mode)
- **APP_BASE_URL**: Used for building links in email templates
