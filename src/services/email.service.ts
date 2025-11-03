// import { Resend } from "resend";

// Инициализация (лучше вынести в отдельный конфиг)
// const resend = new Resend(process.env.RESEND_API_KEY);
// const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

import nodemailer from 'nodemailer';

// Создаем транспорт с оптимизацией для Vercel
const transporter = nodemailer.createTransport({
  host: 'smtp.elasticemail.com',
  port: 2525,
  secure: false, // port 2525 uses TLS
  auth: {
    user: process.env.ELASTIC_EMAIL_USER,
    pass: process.env.ELASTIC_EMAIL_API_KEY
  },
  // Оптимизации для serverless
  connectionTimeout: 10000, // 10 seconds
  greetingTimeout: 10000,
  socketTimeout: 15000,
  // Логирование
  logger: true,
  debug: false
});

export class EmailService {
  static async sendVerificationEmail(email: string, token: string) {
    const verificationUrl = `${process.env.CLIENT_CORS}/verify-email?token=${token}`;

    const mailOptions = {
    from: {
      name: 'Easy Psy',
      address: process.env.ELASTIC_EMAIL_USER || ""
    },
    to: email,
    subject: '✅ Подтвердите ваш email - Easy Psy',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px;">
        <h2>Подтвердите ваш email</h2>
        <p>Для завершения регистрации нажмите на кнопку:</p>
        <a href="${verificationUrl}" style="background: #0070f3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
          Подтвердить Email
        </a>
        <p>Или скопируйте ссылку: ${verificationUrl}</p>
      </div>
    `,
  };

  try {
    const result = await transporter.sendMail(mailOptions);
    console.log(`Verification email sent to: ${email}`);
    return result;
  } catch (error) {
    console.error('Email send error:', error);
    throw error;
  }

    // console.log(verificationUrl, email);
    
    // try {
    //   await resend?.emails.send({
    //     from: 'Easy Psy <onboarding@resend.dev>',
    //     to: email,
    //     subject: 'Подтвердите ваш email',
    //     html: `
    //       <h2>Подтверждение email</h2>
    //       <p>Для завершения регистрации перейдите по ссылке:</p>
    //       <a href="${verificationUrl}">${verificationUrl}</a>
    //       <p>Ссылка действительна в течение 24 часов.</p>
    //     `
    //   });
    // } catch (error) {
    //   console.error('Error sending verification email:', error);
    //   throw new Error('Failed to send verification email');
    // }
  }
}