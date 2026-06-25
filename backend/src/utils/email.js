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
    subject: '🔐 Admin Login Verification',
    html: `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
      <body style="margin:0;padding:0;background:#f5f5f0;font-family:system-ui,-apple-system,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f0;padding:32px 16px;">
          <tr><td align="center">
            <table width="480" cellpadding="0" cellspacing="0" style="max-width:480px;width:100%;">
              <tr><td align="center" style="padding-bottom:24px;">
                <span style="font-size:20px;font-weight:700;color:#0a0a23;letter-spacing:1px;">OMAR KHECHAREM</span>
              </td></tr>
              <tr><td style="background:#ffffff;border-radius:16px;padding:40px 32px;box-shadow:0 4px 24px rgba(0,0,0,0.04);">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr><td align="center" style="padding-bottom:8px;">
                    <span style="display:inline-block;width:48px;height:48px;border-radius:50%;background:#0a0a23;color:#fff;font-size:22px;line-height:48px;">&#128274;</span>
                  </td></tr>
                  <tr><td align="center" style="padding-bottom:4px;">
                    <h1 style="margin:0;font-size:20px;font-weight:700;color:#0a0a23;">Admin Login Verification</h1>
                  </td></tr>
                  <tr><td align="center" style="padding-bottom:20px;">
                    <p style="margin:0;font-size:14px;color:#6b7280;line-height:1.5;">Enter this code to access your admin dashboard.</p>
                  </td></tr>
                  <tr><td align="center" style="padding-bottom:24px;">
                    <div style="display:inline-block;background:#fafaf8;border:1px solid #e5e3df;border-radius:14px;padding:20px 40px;">
                      <span style="font-size:36px;font-weight:800;letter-spacing:10px;color:#0a0a23;font-family:monospace;">${code}</span>
                    </div>
                  </td></tr>
                  <tr><td align="center" style="padding-bottom:4px;">
                    <p style="margin:0;font-size:13px;color:#9ca3af;">This code expires in <strong style="color:#e94560;">10 minutes</strong>.</p>
                  </td></tr>
                  <tr><td align="center">
                    <p style="margin:0;font-size:13px;color:#9ca3af;">If you didn't request this, you can safely ignore this email.</p>
                  </td></tr>
                </table>
              </td></tr>
              <tr><td align="center" style="padding-top:24px;">
                <p style="margin:0 0 4px;font-size:12px;color:#9ca3af;">Omar Khecharem &mdash; Portfolio</p>
                <p style="margin:0;font-size:11px;color:#d0cfc5;">Ariana, Tunisia &bull; omar.khecharem@isimg.tn</p>
              </td></tr>
            </table>
          </td></tr>
        </table>
      </body>
      </html>
    `,
  });

  console.log(`[VERIFICATION CODE] ${email}: ${code}`);
  if (process.env.NODE_ENV !== 'production' || !process.env.EMAIL_HOST) {
    console.log(`[DEV] Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
  }

  return info;
};

module.exports = { sendVerificationCode };
