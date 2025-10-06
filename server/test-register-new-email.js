import axios from 'axios';

async function testRegisterEmail() {
  console.log('🧪 Testing Register with Email OTP (New User)...\n');

  const testData = {
    name: 'Test User 2',
    email: 'testuser2@example.com',
    phone: '+917499128843',
    password: 'Test123',
    channel: 'email'
  };

  try {
    console.log('📤 Sending registration request...');
    console.log('Data:', testData);
    
    const response = await axios.post('http://localhost:5000/api/auth/register', testData);
    
    console.log('✅ Success!');
    console.log('Response:', response.data);
  } catch (error) {
    console.error('❌ Error occurred:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Message:', error.response.data.message);
      console.error('Error:', error.response.data.error);
      console.error('Full response:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error('Error:', error.message);
    }
  }
}

testRegisterEmail();