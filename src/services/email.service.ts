import { Resend } from "resend";

// Инициализация (лучше вынести в отдельный конфиг)
// const resend = new Resend(process.env.RESEND_API_KEY);
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export class EmailService {
  static async sendVerificationEmail(email: string, token: string) {
    const verificationUrl = `${process.env.CLIENT_CORS}/verify-email?token=${token}`;

    // console.log(verificationUrl, email);
    
    try {
      await resend?.emails.send({
        from: 'Easy Psy <onboarding@resend.dev>',
        to: email,
        subject: 'Подтвердите ваш email',
        html: `
          <h2>Подтверждение email</h2>
          <p>Для завершения регистрации перейдите по ссылке:</p>
          <a href="${verificationUrl}">${verificationUrl}</a>
          <p>Ссылка действительна в течение 24 часов.</p>
        `
      });
    } catch (error) {
      console.error('Error sending verification email:', error);
      throw new Error('Failed to send verification email');
    }
  }
}