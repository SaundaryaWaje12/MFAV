/**
 * Test Script for Voice Call OTP Functionality
 * 
 * This script tests the Twilio Voice Call integration directly
 * Run: node test-voice-call.js
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

console.log('🧪 Testing Twilio Voice Call Integration...\n');

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

// Your verified phone number
const testPhoneNumber = '+917499128843';
const testOTP = '123456';

// Convert OTP digits to spoken format
const otpDigits = testOTP.split('').join(', ');

console.log(`📞 Making test voice call to: ${testPhoneNumber}`);
console.log(`🔢 Test OTP: ${testOTP}`);
console.log(`🗣️  Will say: "Your verification code is: ${otpDigits}"\n`);

console.log('⚠️  IMPORTANT: For Twilio trial accounts:');
console.log('   1. The recipient number must be verified in Twilio Console');
console.log('   2. Visit: https://console.twilio.com/us1/develop/phone-numbers/manage/verified');
console.log('   3. Answer the call to hear the OTP\n');

// Create TwiML for Text-to-Speech
const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="alice" language="en-US">Hello! Your verification code is: ${otpDigits}. I repeat, your verification code is: ${otpDigits}. This code expires in 10 minutes.</Say>
  <Pause length="1"/>
  <Say voice="alice" language="en-US">Thank you!</Say>
</Response>`;

try {
  const call = await client.calls.create({
    to: testPhoneNumber,
    from: process.env.TWILIO_PHONE_NUMBER,
    twiml: twiml
  });

  console.log('✅ Voice call initiated successfully!');
  console.log(`   Call SID: ${call.sid}`);
  console.log(`   Status: ${call.status}`);
  console.log(`   To: ${call.to}`);
  console.log(`   From: ${call.from}`);
  console.log(`   Date: ${call.dateCreated}\n`);
  
  console.log('🎉 Test completed successfully!');
  console.log('📞 Answer your phone to hear the OTP message!');
  console.log('🗣️  The voice will say each digit: "1, 2, 3, 4, 5, 6"');
} catch (error) {
  console.error('❌ Error making voice call:');
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
    console.error('💡 Solution: Voice call not enabled for this region/number');
    console.error('   - The number might be invalid or not support voice calls');
    console.error('   - Try a different phone number');
    console.error('   - Verify the number in Twilio Console first');
  } else if (error.code === 20003) {
    console.error('💡 Solution: Authentication failed');
    console.error('   - Check your TWILIO_ACCOUNT_SID in .env');
    console.error('   - Check your TWILIO_AUTH_TOKEN in .env');
  } else if (error.code === 21660) {
    console.error('💡 Solution: Phone number mismatch');
    console.error('   - The FROM number does not belong to your Twilio account');
    console.error('   - Check your TWILIO_PHONE_NUMBER in .env');
  }
  
  process.exit(1);
}