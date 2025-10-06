import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { User } from './src/models/User.js';
import { generateOtp, otpExpiry } from './src/utils/otp.js';
import { sendOtpEmail } from './src/utils/mailer.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env') });

async function sendFreshOTP() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    const email = 'wajesaundarya@gmail.com';
    const user = await User.findOne({ email });

    if (!user) {
      console.log('❌ User not found:', email);
      return;
    }

    console.log('🎯 Generating Fresh OTP for Login Test\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    // Generate new random OTP
    const otp = generateOtp(6);
    user.otpCode = otp;
    user.otpChannel = 'email';
    user.otpExpiresAt = otpExpiry(10);
    await user.save();

    console.log('📧 Sending OTP via Email...');
    await sendOtpEmail({ to: user.email, otp });
    
    console.log('\n✅ OTP SENT SUCCESSFULLY!\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 OTP Details:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Email:', user.email);
    console.log('OTP Code:', otp);
    console.log('Channel:', user.otpChannel);
    console.log('Expires At:', user.otpExpiresAt);
    console.log('Valid For:', '10 minutes');
    
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🧪 How to Test:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('1. Check your email:', user.email);
    console.log('2. Copy the OTP from the email');
    console.log('3. Go to: http://localhost:5173/login');
    console.log('4. Enter email:', user.email);
    console.log('5. Enter OTP:', otp);
    console.log('6. Click "Verify OTP"');
    console.log('7. You should see: "✅ Verified successfully!"');
    
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('⚠️  IMPORTANT:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('• Use the OTP from your EMAIL, not from this console!');
    console.log('• The OTP shown here is for reference only');
    console.log('• Always verify using the email OTP for security');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
  } finally {
    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');
  }
}

sendFreshOTP();