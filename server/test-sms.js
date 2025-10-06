/**
 * Test Script for SMS OTP Functionality
 * 
 * This script tests the Twilio SMS integration directly
 * Run: node test-sms.js
 */

import dotenv from 'dotenv';
import twilio from 'twilio';

// Load environment variables
dotenv.config();

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

async function testSMS() {
  console.log('🧪 Testing Twilio SMS Integration...\n');
  
  // Check environment variables
  console.log('📋 Configuration:');
  console.log(`   Account SID: ${process.env.TWILIO_ACCOUNT_SID}`);
  console.log(`   Auth Token: ${process.env.TWILIO_AUTH_TOKEN ? '***' + process.env.TWILIO_AUTH_TOKEN.slice(-4) : 'NOT SET'}`);
  console.log(`   Phone Number: ${process.env.TWILIO_PHONE_NUMBER}\n`);

  if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN || !process.env.TWILIO_PHONE_NUMBER) {
    console.error('❌ Error: Missing Twilio configuration in .env file');
    process.exit(1);
  }

  // Test phone number (replace with your verified number for testing)
  const testPhoneNumber = process.env.TEST_PHONE_NUMBER || '+18777804236';
  const testOTP = '123456';

  console.log(`📱 Sending test SMS to: ${testPhoneNumber}`);
  console.log(`🔢 Test OTP: ${testOTP}\n`);

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
  } catch (error) {
    console.error('❌ Error sending SMS:');
    console.error(`   Code: ${error.code}`);
    console.error(`   Message: ${error.message}`);
    
    if (error.code === 21211) {
      console.error('\n💡 Tip: The phone number is invalid. Make sure to include country code (e.g., +1234567890)');
    } else if (error.code === 21608) {
      console.error('\n💡 Tip: For trial accounts, you need to verify the phone number in Twilio Console first');
    } else if (error.code === 20003) {
      console.error('\n💡 Tip: Authentication failed. Check your Account SID and Auth Token');
    }
    
    process.exit(1);
  }
}

// Run the test
testSMS();