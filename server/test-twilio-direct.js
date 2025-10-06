import twilio from 'twilio';

// Using the credentials you just provided
const accountSid = 'AC386c57c8604c8be76d6264e7f89419d4';
const authToken = '6de988a45bdc59e93b8f4cca1e4525ba';
const phoneNumber = '+14195154252';

console.log('🔍 Testing Twilio with YOUR credentials...\n');
console.log('Account SID:', accountSid);
console.log('Auth Token:', '***' + authToken.slice(-4));
console.log('Phone Number:', phoneNumber);
console.log('\n' + '='.repeat(50));

const client = twilio(accountSid, authToken);

async function testTwilio() {
  try {
    console.log('\n📱 Step 1: Fetching phone numbers in this account...\n');
    
    const incomingPhoneNumbers = await client.incomingPhoneNumbers.list();
    
    if (incomingPhoneNumbers.length === 0) {
      console.log('❌ No phone numbers found in account:', accountSid);
      console.log('\n💡 This is a TRIAL account with no purchased numbers.');
      console.log('\n🔧 Options:');
      console.log('   1. Buy a phone number: https://console.twilio.com/us1/develop/phone-numbers/manage/search');
      console.log('   2. Verify a phone number for testing: https://console.twilio.com/us1/develop/phone-numbers/manage/verified');
      console.log('\n📝 For trial accounts, you can only send to VERIFIED numbers.');
    } else {
      console.log(`✅ Found ${incomingPhoneNumbers.length} phone number(s):\n`);
      incomingPhoneNumbers.forEach((number, index) => {
        console.log(`${index + 1}. ${number.phoneNumber}`);
        console.log(`   Friendly Name: ${number.friendlyName}`);
        console.log(`   SMS: ${number.capabilities.sms ? '✅' : '❌'}`);
        console.log(`   Voice: ${number.capabilities.voice ? '✅' : '❌'}`);
        console.log('');
      });
    }
    
    console.log('\n📋 Step 2: Checking if +14195154252 belongs to this account...\n');
    
    const matchingNumber = incomingPhoneNumbers.find(n => n.phoneNumber === phoneNumber);
    
    if (matchingNumber) {
      console.log('✅ YES! This number belongs to your account!');
      console.log('   You can use it for SMS and Voice calls.');
    } else {
      console.log('❌ NO! This number does NOT belong to your account!');
      console.log('\n🔍 The number +14195154252 belongs to a DIFFERENT Twilio account.');
      console.log('\n💡 You need to either:');
      console.log('   1. Use a phone number from the list above');
      console.log('   2. Get the correct credentials for +14195154252');
    }
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.log('\n🔍 This could mean:');
    console.log('   1. Invalid Account SID or Auth Token');
    console.log('   2. Account suspended or deactivated');
    console.log('   3. Network connectivity issue');
  }
}

testTwilio();