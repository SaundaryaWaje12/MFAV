import twilio from 'twilio';
import dotenv from 'dotenv';

dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

console.log('🔍 Checking Twilio Account...\n');
console.log('Account SID:', accountSid);
console.log('Auth Token:', '***' + authToken.slice(-4));
console.log('\n' + '='.repeat(50));

const client = twilio(accountSid, authToken);

async function checkTwilioNumbers() {
  try {
    console.log('\n📱 Fetching your Twilio phone numbers...\n');
    
    const incomingPhoneNumbers = await client.incomingPhoneNumbers.list();
    
    if (incomingPhoneNumbers.length === 0) {
      console.log('❌ No phone numbers found in this account!');
      console.log('\n💡 You need to:');
      console.log('   1. Buy a phone number from Twilio Console');
      console.log('   2. Or verify a phone number for trial account');
      console.log('\n🔗 Visit: https://console.twilio.com/us1/develop/phone-numbers/manage/incoming');
    } else {
      console.log(`✅ Found ${incomingPhoneNumbers.length} phone number(s):\n`);
      incomingPhoneNumbers.forEach((number, index) => {
        console.log(`${index + 1}. ${number.phoneNumber}`);
        console.log(`   Friendly Name: ${number.friendlyName}`);
        console.log(`   Capabilities: SMS=${number.capabilities.sms}, Voice=${number.capabilities.voice}`);
        console.log('');
      });
      
      console.log('💡 Use one of these numbers in your .env file as TWILIO_PHONE_NUMBER');
    }
    
  } catch (error) {
    console.error('❌ Error checking Twilio account:', error.message);
    console.log('\n🔍 Possible issues:');
    console.log('   1. Invalid Account SID or Auth Token');
    console.log('   2. Network connectivity issue');
    console.log('   3. Twilio account suspended');
    console.log('\n🔗 Check your credentials at: https://console.twilio.com/');
  }
}

checkTwilioNumbers();