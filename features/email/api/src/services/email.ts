import Mailjet from 'node-mailjet'

const MAILJET_API_KEY = process.env.MAILJET_API_KEY || ''
const MAILJET_SECRET_KEY = process.env.MAILJET_SECRET_KEY || ''
const SENDER_EMAIL = process.env.MAILJET_SENDER_EMAIL || 'noreply@example.com'
const APP_BASE_URL = process.env.APP_BASE_URL || 'http://localhost'

const mailjet = Mailjet.apiConnect(MAILJET_API_KEY, MAILJET_SECRET_KEY)

interface SendEmailOptions {
  to: string
  toName?: string
  subject: string
  html: string
  text?: string
}

export async function sendEmail(options: SendEmailOptions): Promise<void> {
  if (!MAILJET_API_KEY || !MAILJET_SECRET_KEY) {
    console.warn('Mailjet credentials not configured, skipping email send')
    console.log(`Would send email to ${options.to}: ${options.subject}`)
    return
  }

  await mailjet.post('send', { version: 'v3.1' }).request({
    Messages: [
      {
        From: {
          Email: SENDER_EMAIL,
          Name: '{{PROJECT_NAME}}',
        },
        To: [
          {
            Email: options.to,
            Name: options.toName || options.to,
          },
        ],
        Subject: options.subject,
        HTMLPart: options.html,
        TextPart: options.text || '',
      },
    ],
  })
}

export { APP_BASE_URL }
