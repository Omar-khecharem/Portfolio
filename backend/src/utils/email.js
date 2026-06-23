const nodemailer = require('nodemailer');

const createTransporter = async () => {
  if (process.env.EMAIL_HOST) {
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  const testAccount = await nodemailer.createTestAccount();
  return nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
};

const sendVerificationCode = async (email, code) => {
  const transporter = await createTransporter();

  const info = await transporter.sendMail({
    from: process.env.EMAIL_FROM || '"Portfolio Admin" <noreply@omarkhecharem.com>',
    to: email,
    subject: 'Admin Login Verification Code',
    html: `
      <div style="font-family: system-ui, sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color: #0a0a23;">Admin Login Verification</h2>
        <p style="color: #6b7280; font-size: 15px;">Your verification code is:</p>
        <div style="background: #fafaf8; border: 1px solid #e5e3df; border-radius: 12px; padding: 24px; text-align: center; margin: 20px 0;">
          <span style="font-size: 32px; font-weight: 700; letter-spacing: 8px; color: #0a0a23;">${code}</span>
        </div>
        <p style="color: #6b7280; font-size: 13px;">This code expires in 10 minutes. If you did not request this, ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #e5e3df; margin: 20px 0;">
        <p style="color: #9ca3af; font-size: 12px;">Omar Khecharem &mdash; Portfolio Admin</p>
      </div>
    `,
  });

  if (process.env.NODE_ENV !== 'production' || !process.env.EMAIL_HOST) {
    console.log(`[DEV] Verification code for ${email}: ${code}`);
    console.log(`[DEV] Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
  }

  return info;
};

module.exports = { sendVerificationCode };
