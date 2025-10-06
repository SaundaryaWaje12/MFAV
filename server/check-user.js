// Check if user exists and is verified
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from './src/models/User.js';

dotenv.config();

async function checkUser() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');
    
    const email = 'wajesaundarya@gmail.com'; // Replace with your test email
    const user = await User.findOne({ email });
    
    if (!user) {
      console.log(`❌ User not found: ${email}`);
      console.log('\n💡 You need to register first before you can login!');
    } else {
      console.log('✅ User found:');
      console.log('  Email:', user.email);
      console.log('  Name:', user.name);
      console.log('  Phone:', user.phone);
      console.log('  Is Verified:', user.isVerified);
      console.log('  Created:', user.createdAt);
      
      if (!user.isVerified) {
        console.log('\n⚠️  User is NOT verified. You need to verify the account first!');
      } else {
        console.log('\n✅ User is verified and ready for login!');
      }
    }
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkUser();