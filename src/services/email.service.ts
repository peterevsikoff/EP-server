import nodemailer from 'nodemailer';

// Создаем транспорт с оптимизацией для Vercel
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_EMAIL,
    pass: process.env.GMAIL_APP_PASSWORD
  }
});

export async function sendVerificationEmail(userEmail: string, verificationToken: string) {
    const verificationLink = `${process.env.CLIENT_CORS}/signUp/verifyEmail?token=${verificationToken}`;
  
    const mailOptions = {
        from: `Easy Psy <${process.env.GMAIL_EMAIL}>`,
        to: userEmail,
        subject: 'Подтверждение email для Easy Psy',
        html: `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Подтверждение email</title>
            <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
            .container { background: #f9f9f9; border-radius: 10px; padding: 30px; }
            .button { background: #0070f3; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; display: inline-block; font-size: 16px; font-weight: bold; }
            .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
            </style>
        </head>
        <body>
            <div class="container">
            <h2 style="color: #000; margin-bottom: 20px;">Добро пожаловать в Easy Psy!</h2>
            
            <p>Для завершения регистрации и активации вашего аккаунта необходимо подтвердить ваш email адрес.</p>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="${verificationLink}" class="button">
                Подтвердить мой email
                </a>
            </div>
            
            <p>Если кнопка не работает, скопируйте и вставьте следующую ссылку в адресную строку браузера:</p>
            <p style="background: #fff; padding: 10px; border-radius: 5px; border: 1px solid #ddd; word-break: break-all;">
                ${verificationLink}
            </p>
            
            <div class="footer">
                <p>Это письмо отправлено автоматически. Пожалуйста, не отвечайте на него.</p>
                <p>Если вы не регистрировались в Easy Psy, просто проигнорируйте это сообщение.</p>
                <p>© ${new Date().getFullYear()} Easy Psy. Все права защищены.</p>
            </div>
            </div>
        </body>
        </html>
        `,
        text: `
        Подтверждение email для Easy Psy

        Добро пожаловать! Для завершения регистрации перейдите по ссылке:

        ${verificationLink}

        Если ссылка не работает, скопируйте и вставьте ее в браузер.

        Это письмо отправлено автоматически. Не отвечайте на него.

        © ${new Date().getFullYear()} Easy Psy
            `.trim()
    };

    try {
        const result = await transporter.sendMail(mailOptions);
        // console.log('✅ Gmail email sent with improved content');
        // console.log(result);
        return result;
    } catch (error) {
        // console.error('❌ Gmail error:', error);
        throw error;
    }
}