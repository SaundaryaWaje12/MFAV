import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { User } from './src/models/User.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env') });

async function checkOTP() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const email = 'wajesaundarya@gmail.com';
    const user = await User.findOne({ email });

    if (!user) {
      console.log('❌ User not found:', email);
      return;
    }

    console.log('\n📊 User OTP Details:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Email:', user.email);
    console.log('Name:', user.name);
    console.log('Phone:', user.phone);
    console.log('Is Verified:', user.isVerified);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('OTP Code:', user.otpCode);
    console.log('OTP Type:', typeof user.otpCode);
    console.log('OTP Length:', user.otpCode ? user.otpCode.length : 0);
    console.log('OTP Channel:', user.otpChannel);
    console.log('OTP Expires At:', user.otpExpiresAt);
    console.log('Current Time:', new Date());
    console.log('Is Expired:', user.otpExpiresAt < new Date());
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    // Test comparison
    const testOTP = '123456';
    console.log('\n🧪 Testing OTP Comparison:');
    console.log('Test OTP:', testOTP, '(type:', typeof testOTP + ')');
    console.log('Stored OTP:', user.otpCode, '(type:', typeof user.otpCode + ')');
    console.log('Strict Equality (===):', user.otpCode === testOTP);
    console.log('Loose Equality (==):', user.otpCode == testOTP);
    console.log('String Comparison:', String(user.otpCode) === String(testOTP));

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');
  }
}

checkOTP();