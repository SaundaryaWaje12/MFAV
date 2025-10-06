import nodemailer from 'nodemailer';

// Create transporter lazily to ensure env vars are loaded
let transporter = null;

function getTransporter() {
  if (!transporter) {
    const port = Number(process.env.SMTP_PORT || 587);
    const secure = process.env.SMTP_SECURE === 'true' || port === 465;
    
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: port,
      secure: secure,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }
  return transporter;
}

export async function sendOtpEmail({ to, otp }) {
  const transporter = getTransporter();
  const info = await transporter.sendMail({
    from: process.env.FROM_EMAIL || 'no-reply@example.com',
    to,
    subject: 'Your OTP Verification Code',
    text: `Your OTP is ${otp}. It expires in 10 minutes.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #333;">Your OTP Verification Code</h2>
        <p style="font-size: 16px; color: #555;">Use the following code to complete your verification:</p>
        <div style="background-color: #f4f4f4; border: 2px solid #4CAF50; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
          <h1 style="color: #4CAF50; font-size: 48px; margin: 0; letter-spacing: 8px;">${otp}</h1>
        </div>
        <p style="font-size: 14px; color: #777;">
          ⏰ This code will expire in <strong>10 minutes</strong>.<br>
          🔒 For security reasons, do not share this code with anyone.
        </p>
        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
        <p style="font-size: 12px; color: #999;">
          If you didn't request this code, please ignore this email.
        </p>
      </div>
    `
  });
  console.log('📧 [EMAIL] OTP sent to:', to, '| OTP:', otp, '| Message ID:', info.messageId);
  return info.messageId;
}