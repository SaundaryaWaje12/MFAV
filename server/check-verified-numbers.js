import twilio from 'twilio';
import dotenv from 'dotenv';

dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

console.log('🔍 Checking Twilio Verified Numbers...\n');
console.log('Account SID:', accountSid);
console.log('\n' + '='.repeat(50) + '\n');

const client = twilio(accountSid, authToken);

async function checkVerifiedNumbers() {
  try {
    // Check account info
    const account = await client.api.accounts(accountSid).fetch();
    console.log('📊 Account Status:', account.status);
    console.log('📊 Account Type:', account.type);
    console.log('\n');
    
    // Check verified caller IDs (for trial accounts)
    console.log('📱 Verified Caller IDs (for outgoing calls):');
    const verifiedNumbers = await client.validationRequests.list();
    
    if (verifiedNumbers.length === 0) {
      console.log('   ❌ No verified numbers found!');
      console.log('\n💡 For TRIAL accounts, you can only call VERIFIED numbers.');
      console.log('   To verify +917499128843:');
      console.log('   1. Go to: https://console.twilio.com/us1/develop/phone-numbers/manage/verified');
      console.log('   2. Click "Add a new number"');
      console.log('   3. Enter +917499128843');
      console.log('   4. Complete the verification process');
    } else {
      verifiedNumbers.forEach((num, index) => {
        console.log(`   ${index + 1}. ${num.phoneNumber} - ${num.friendlyName}`);
      });
    }
    
    console.log('\n📞 Checking if +917499128843 can receive calls...');
    
    // Check outgoing caller IDs
    const outgoingCallerIds = await client.outgoingCallerIds.list();
    const isVerified = outgoingCallerIds.some(id => id.phoneNumber === '+917499128843');
    
    if (isVerified) {
      console.log('   ✅ +917499128843 is verified and can receive calls!');
    } else {
      console.log('   ❌ +917499128843 is NOT verified!');
      console.log('\n🚨 IMPORTANT: Trial accounts can only call verified numbers!');
      console.log('   Verify this number at: https://console.twilio.com/us1/develop/phone-numbers/manage/verified');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkVerifiedNumbers();