// Comprehensive test for all OTP channels
import dotenv from 'dotenv';
import { sendOtpEmail } from './src/utils/mailer.js';
import { sendOtpSms, sendOtpCall } from './src/utils/twilio.js';

dotenv.config();

const testEmail = process.env.SMTP_USER || 'wajesaundarya@gmail.com';
const testPhone = '+917499128843'; // Your phone number
const testOtp = '123456';

async function testAllChannels() {
  console.log('🧪 Testing All OTP Channels\n');
  console.log('=' .repeat(50));
  
  // Test 1: Email OTP
  console.log('\n📧 TEST 1: Email OTP');
  console.log('-'.repeat(50));
  try {
    console.log(`Sending to: ${testEmail}`);
    console.log(`OTP: ${testOtp}`);
    const messageId = await sendOtpEmail({ to: testEmail, otp: testOtp });
    console.log('✅ Email sent successfully!');
    console.log(`Message ID: ${messageId}`);
  } catch (error) {
    console.error('❌ Email failed:', error.message);
    console.error('Full error:', error);
  }
  
  // Test 2: SMS OTP
  console.log('\n\n📱 TEST 2: SMS OTP');
  console.log('-'.repeat(50));
  try {
    console.log(`Sending to: ${testPhone}`);
    console.log(`OTP: ${testOtp}`);
    const sid = await sendOtpSms({ to: testPhone, otp: testOtp });
    console.log('✅ SMS sent successfully!');
    console.log(`Message SID: ${sid}`);
  } catch (error) {
    console.error('❌ SMS failed:', error.message);
    console.error('Full error:', error);
  }
  
  // Test 3: Voice Call OTP
  console.log('\n\n📞 TEST 3: Voice Call OTP');
  console.log('-'.repeat(50));
  try {
    console.log(`Calling: ${testPhone}`);
    console.log(`OTP: ${testOtp}`);
    const sid = await sendOtpCall({ to: testPhone, otp: testOtp });
    console.log('✅ Voice call initiated successfully!');
    console.log(`Call SID: ${sid}`);
    console.log('📞 You should receive a call in a few seconds...');
  } catch (error) {
    console.error('❌ Voice call failed:', error.message);
    console.error('Full error:', error);
  }
  
  console.log('\n' + '='.repeat(50));
  console.log('🏁 Testing Complete!\n');
}

testAllChannels();