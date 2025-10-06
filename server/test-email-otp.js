import dotenv from 'dotenv';
import { sendOtpEmail } from './src/utils/mailer.js';

dotenv.config();

async function testEmailOtp() {
  console.log('🧪 Testing Email OTP...\n');
  
  console.log('📧 Email Configuration:');
  console.log('  SMTP Host:', process.env.SMTP_HOST);
  console.log('  SMTP Port:', process.env.SMTP_PORT);
  console.log('  SMTP User:', process.env.SMTP_USER);
  console.log('  From Email:', process.env.FROM_EMAIL);
  console.log('');

  const testOtp = '123456';
  const testEmail = process.env.SMTP_USER; // Send to yourself for testing

  try {
    console.log(`📤 Sending OTP ${testOtp} to ${testEmail}...`);
    const messageId = await sendOtpEmail({ to: testEmail, otp: testOtp });
    console.log('✅ Email sent successfully!');
    console.log('📬 Message ID:', messageId);
    console.log('\n🎉 Email OTP is working! Check your inbox.');
  } catch (error) {
    console.error('❌ Email sending failed:');
    console.error('Error:', error.message);
    if (error.code) {
      console.error('Error Code:', error.code);
    }
    if (error.response) {
      console.error('Response:', error.response);
    }
  }
}

testEmailOtp();