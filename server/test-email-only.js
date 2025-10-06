// Quick email test
import dotenv from 'dotenv';
import { sendOtpEmail } from './src/utils/mailer.js';

dotenv.config();

async function testEmail() {
  console.log('📧 Testing Email OTP...\n');
  console.log('Configuration:');
  console.log('  SMTP Host:', process.env.SMTP_HOST);
  console.log('  SMTP Port:', process.env.SMTP_PORT);
  console.log('  SMTP Secure:', process.env.SMTP_SECURE);
  console.log('  SMTP User:', process.env.SMTP_USER);
  console.log('  SMTP Pass:', process.env.SMTP_PASS ? '***' + process.env.SMTP_PASS.slice(-4) : 'NOT SET');
  console.log('  From Email:', process.env.FROM_EMAIL);
  console.log('');
  
  try {
    const testEmail = process.env.SMTP_USER || 'wajesaundarya@gmail.com';
    const testOtp = '123456';
    
    console.log(`Sending OTP ${testOtp} to ${testEmail}...`);
    const messageId = await sendOtpEmail({ to: testEmail, otp: testOtp });
    
    console.log('\n✅ SUCCESS! Email sent!');
    console.log('Message ID:', messageId);
    console.log('\n📬 Check your inbox:', testEmail);
  } catch (error) {
    console.error('\n❌ FAILED!');
    console.error('Error:', error.message);
    
    if (error.message.includes('535')) {
      console.error('\n💡 This is a Gmail authentication error.');
      console.error('   Your app password is invalid or expired.');
      console.error('   Please generate a new one at:');
      console.error('   https://myaccount.google.com/apppasswords');
    }
  }
}

testEmail();