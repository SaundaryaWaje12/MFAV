/**
 * Direct SMS Test - Uses credentials directly from .env
 */

import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from current directory
const envPath = join(__dirname, '.env');
console.log(`📁 Loading .env from: ${envPath}\n`);
dotenv.config({ path: envPath });

console.log('🧪 Testing Twilio SMS Integration...\n');

// Display loaded configuration
console.log('📋 Configuration loaded:');
console.log(`   Account SID: ${process.env.TWILIO_ACCOUNT_SID}`);
console.log(`   Auth Token: ${process.env.TWILIO_AUTH_TOKEN ? '***' + process.env.TWILIO_AUTH_TOKEN.slice(-4) : 'NOT SET'}`);
console.log(`   Phone Number: ${process.env.TWILIO_PHONE_NUMBER}\n`);

if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN || !process.env.TWILIO_PHONE_NUMBER) {
  console.error('❌ Error: Missing Twilio configuration in .env file');
  process.exit(1);
}

// Import Twilio after env is loaded
const twilio = (await import('twilio')).default;
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// IMPORTANT: Replace this with YOUR verified phone number
const testPhoneNumber = '+917499128843'; // Your verified phone number
const testOTP = '123456';

console.log(`📱 Sending test SMS to: ${testPhoneNumber}`);
console.log(`🔢 Test OTP: ${testOTP}\n`);

console.log('⚠️  IMPORTANT: For Twilio trial accounts:');
console.log('   1. The recipient number must be verified in Twilio Console');
console.log('   2. Visit: https://console.twilio.com/us1/develop/phone-numbers/manage/verified');
console.log('   3. Add your phone number if not already verified\n');

try {
  const message = await client.messages.create({
    body: `Your verification code is ${testOTP}. It expires in 10 minutes. Do not share this code with anyone.`,
    to: testPhoneNumber,
    from: process.env.TWILIO_PHONE_NUMBER
  });

  console.log('✅ SMS sent successfully!');
  console.log(`   Message SID: ${message.sid}`);
  console.log(`   Status: ${message.status}`);
  console.log(`   To: ${message.to}`);
  console.log(`   From: ${message.from}`);
  console.log(`   Date: ${message.dateCreated}\n`);
  
  console.log('🎉 Test completed successfully!');
  console.log('📱 Check your phone for the SMS message!');
} catch (error) {
  console.error('❌ Error sending SMS:');
  console.error(`   Code: ${error.code}`);
  console.error(`   Message: ${error.message}\n`);
  
  if (error.code === 21211) {
    console.error('💡 Solution: The phone number format is invalid');
    console.error('   - Use E.164 format: +1234567890 (country code + number)');
    console.error('   - Example: +14155552671');
  } else if (error.code === 21608) {
    console.error('💡 Solution: Phone number not verified for trial account');
    console.error('   - Visit: https://console.twilio.com/us1/develop/phone-numbers/manage/verified');
    console.error('   - Click "Add a new number" and verify your phone');
  } else if (error.code === 21408) {
    console.error('💡 Solution: SMS not enabled for this region/number');
    console.error('   - The number might be invalid or not support SMS');
    console.error('   - Try a different phone number');
    console.error('   - Verify the number in Twilio Console first');
  } else if (error.code === 20003) {
    console.error('💡 Solution: Authentication failed');
    console.error('   - Check your TWILIO_ACCOUNT_SID in .env');
    console.error('   - Check your TWILIO_AUTH_TOKEN in .env');
  }
  
  process.exit(1);
}