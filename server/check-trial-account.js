import twilio from 'twilio';
import dotenv from 'dotenv';

dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

console.log('🔍 Checking Twilio Account Status...\n');

const client = twilio(accountSid, authToken);

async function checkAccount() {
  try {
    // Check account info
    const account = await client.api.accounts(accountSid).fetch();
    console.log('📊 Account Status:', account.status);
    console.log('📊 Account Type:', account.type);
    console.log('📊 Friendly Name:', account.friendlyName);
    
    if (account.type === 'Trial') {
      console.log('\n🚨 THIS IS A TRIAL ACCOUNT!');
      console.log('\n⚠️  Trial Account Limitations:');
      console.log('   1. ❌ Can only call/SMS VERIFIED phone numbers');
      console.log('   2. ❌ All calls will have a Twilio trial message');
      console.log('   3. ❌ Limited credits');
      console.log('\n💡 To call +917499128843, you MUST verify it first:');
      console.log('   🔗 https://console.twilio.com/us1/develop/phone-numbers/manage/verified');
      console.log('\n📝 Steps to verify:');
      console.log('   1. Click "Add a new number"');
      console.log('   2. Enter: +917499128843');
      console.log('   3. Choose verification method (SMS or Call)');
      console.log('   4. Enter the verification code you receive');
      console.log('   5. After verification, voice calls will work!');
    } else {
      console.log('\n✅ This is a PAID account - no restrictions!');
    }
    
    // Check verified caller IDs
    console.log('\n📱 Checking Verified Outgoing Caller IDs...');
    const outgoingCallerIds = await client.outgoingCallerIds.list();
    
    if (outgoingCallerIds.length === 0) {
      console.log('   ❌ No verified numbers found!');
      console.log('   You need to verify +917499128843 to receive calls.');
    } else {
      console.log(`   Found ${outgoingCallerIds.length} verified number(s):\n`);
      outgoingCallerIds.forEach((id, index) => {
        console.log(`   ${index + 1}. ${id.phoneNumber}`);
        console.log(`      Friendly Name: ${id.friendlyName}`);
        console.log('');
      });
      
      const isVerified = outgoingCallerIds.some(id => id.phoneNumber === '+917499128843');
      if (isVerified) {
        console.log('   ✅ +917499128843 is verified! Voice calls should work.');
      } else {
        console.log('   ❌ +917499128843 is NOT in the verified list!');
        console.log('   Please verify it to receive voice calls.');
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkAccount();