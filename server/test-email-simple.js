import nodemailer from 'nodemailer';

async function testEmail() {
  console.log('🧪 Testing Email OTP...\n');

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: 'wajesaundarya@gmail.com',
      pass: 'pfmihnodxeoxfjs'
    },
    connectionTimeout: 60000,
    greetingTimeout: 30000,
    socketTimeout: 60000
  });

  try {
    console.log('📤 Sending test email...');
    const info = await transporter.sendMail({
      from: 'wajesaundarya@gmail.com',
      to: 'wajesaundarya@gmail.com',
      subject: 'Test OTP',
      text: 'Your OTP is 123456',
      html: '<p>Your OTP is <b>123456</b></p>'
    });
    
    console.log('✅ Email sent successfully!');
    console.log('Message ID:', info.messageId);
  } catch (error) {
    console.error('❌ Email failed:');
    console.error('Error:', error.message);
    console.error('Code:', error.code);
    console.error('Command:', error.command);
  }
}

testEmail();