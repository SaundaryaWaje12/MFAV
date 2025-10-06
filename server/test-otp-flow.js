import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { User } from './src/models/User.js';
import { generateOtp, otpExpiry } from './src/utils/otp.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env') });

async function testOTPFlow() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    const email = 'wajesaundarya@gmail.com';
    const user = await User.findOne({ email });

    if (!user) {
      console.log('❌ User not found:', email);
      return;
    }

    console.log('🎯 Testing Random OTP Generation\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    // Generate 5 random OTPs to show they're different
    console.log('📊 Generating 5 Random OTPs:');
    for (let i = 1; i <= 5; i++) {
      const randomOTP = generateOtp(6);
      console.log(`   ${i}. ${randomOTP}`);
    }
    
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Current OTP in Database for:', email);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('OTP Code:', user.otpCode || 'No OTP set');
    console.log('OTP Channel:', user.otpChannel || 'N/A');
    console.log('OTP Expires At:', user.otpExpiresAt || 'N/A');
    console.log('Is Expired:', user.otpExpiresAt ? (user.otpExpiresAt < new Date() ? 'YES ❌' : 'NO ✅') : 'N/A');
    
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('💡 How to Test:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('1. Go to: http://localhost:5173/login');
    console.log('2. Enter email: wajesaundarya@gmail.com');
    console.log('3. Click "📧 Send Email OTP"');
    console.log('4. Check your email for the NEW random OTP');
    console.log('5. Enter the OTP from your email (NOT 123456!)');
    console.log('6. Click "Verify OTP"');
    console.log('7. You should see: "✅ Verified successfully!"');
    
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('⚠️  IMPORTANT:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('• Each time you click "Send Email OTP", a NEW random OTP is generated');
    console.log('• The OTP in your email is the ONLY valid OTP');
    console.log('• OTPs expire after 10 minutes');
    console.log('• You must use the LATEST OTP sent to your email');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');
  }
}

testOTPFlow();