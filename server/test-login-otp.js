// Test script to simulate login OTP request
import axios from 'axios';

const API = 'http://localhost:5000/api';

async function testLoginOtp() {
  try {
    console.log('🧪 Testing Login OTP Request...\n');
    
    // Test with email channel
    console.log('📧 Testing Email OTP...');
    const emailResponse = await axios.post(`${API}/auth/login/otp/request`, {
      email: 'wajesaundarya@gmail.com', // Replace with your test email
      channel: 'email'
    });
    console.log('✅ Email OTP Response:', emailResponse.data);
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
    console.error('Status:', error.response?.status);
    console.error('Full error:', error);
  }
}

testLoginOtp();