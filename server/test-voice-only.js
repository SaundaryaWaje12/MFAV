import dotenv from 'dotenv';
import { sendOtpCall } from './src/utils/twilio.js';

dotenv.config();

console.log('📞 Testing Voice Call OTP...\n');
console.log('Configuration:');
console.log('  Account SID:', process.env.TWILIO_ACCOUNT_SID);
console.log('  Auth Token:', '***' + process.env.TWILIO_AUTH_TOKEN?.slice(-4));
console.log('  From Number:', process.env.TWILIO_PHONE_NUMBER);
console.log('  To Number: +917499128843');
console.log('\n' + '='.repeat(50) + '\n');

async function testVoiceCall() {
  try {
    console.log('🔄 Initiating voice call...\n');
    
    const callSid = await sendOtpCall({ 
      to: '+917499128843', 
      otp: '123456' 
    });
    
    console.log('✅ SUCCESS! Voice call initiated!');
    console.log('Call SID:', callSid);
    console.log('\n📞 The call should arrive within 10-30 seconds.');
    console.log('💡 Answer the phone to hear the OTP spoken to you.');
    console.log('\n🔗 Check call status at:');
    console.log(`   https://console.twilio.com/us1/monitor/logs/calls/${callSid}`);
    
  } catch (error) {
    console.error('❌ FAILED!');
    console.error('Error:', error.message);
    console.error('\nFull error:', error);
    
    console.log('\n🔍 Troubleshooting:');
    console.log('   1. Check if your Twilio account is in trial mode');
    console.log('   2. Verify the destination number (+917499128843) is verified in Twilio');
    console.log('   3. Check if you have voice call credits');
    console.log('   4. Visit: https://console.twilio.com/us1/develop/phone-numbers/manage/verified');
  }
}

testVoiceCall();