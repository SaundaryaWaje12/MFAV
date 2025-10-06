import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from './src/models/User.js';

dotenv.config();

async function verifyUser() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected');

    const email = 'wajesaundarya@gmail.com';
    
    // Find user
    const user = await User.findOne({ email });
    
    if (!user) {
      console.log('❌ User not found with email:', email);
      console.log('\n💡 Please register first at: http://localhost:5173/register');
      process.exit(0);
    }

    console.log('\n📋 User Details:');
    console.log('Name:', user.name);
    console.log('Email:', user.email);
    console.log('Phone:', user.phone);
    console.log('Verified:', user.isVerified);
    console.log('OTP Code:', user.otpCode);
    console.log('OTP Expires:', user.otpExpiresAt);

    if (!user.isVerified) {
      console.log('\n🔧 Setting user as verified...');
      user.isVerified = true;
      user.otpCode = undefined;
      user.otpExpiresAt = undefined;
      user.otpChannel = undefined;
      await user.save();
      console.log('✅ User is now verified!');
    } else {
      console.log('✅ User is already verified!');
    }

    await mongoose.disconnect();
    console.log('\n✅ Done!');
  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
}

verifyUser();