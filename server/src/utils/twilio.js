import twilio from 'twilio';

// Lazy-load Twilio client to ensure env vars are loaded
function getTwilioClient() {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  
  if (!accountSid || !authToken) {
    throw new Error('Twilio credentials are not configured. Set TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN in your environment.');
  }
  
  return twilio(accountSid, authToken);
}

// Send OTP via SMS
export async function sendOtpSms({ to, otp }) {
  const client = getTwilioClient();
  const fromNumber = process.env.TWILIO_PHONE_NUMBER || process.env.TWILIO_CALLER_ID;
  if (!fromNumber) {
    throw new Error('Twilio phone number is not configured. Set TWILIO_PHONE_NUMBER or TWILIO_CALLER_ID in your environment.');
  }

  const message = await client.messages.create({
    body: `Your verification code is ${otp}. It expires in 10 minutes. Do not share this code with anyone.`,
    to,
    from: fromNumber
  });
  
  return message.sid;
}

// Send OTP via Voice Call (Text-to-Speech)
export async function sendOtpCall({ to, otp }) {
  const client = getTwilioClient();
  const fromNumber = process.env.TWILIO_PHONE_NUMBER || process.env.TWILIO_CALLER_ID;
  if (!fromNumber) {
    throw new Error('Twilio phone number is not configured. Set TWILIO_PHONE_NUMBER or TWILIO_CALLER_ID in your environment.');
  }

  // Convert OTP digits to spoken format: "1, 2, 3, 4, 5, 6"
  const otpDigits = otp.split('').join(', ');
  
  // Create TwiML for Text-to-Speech
  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="alice" language="en-US">Hello! Your verification code is: ${otpDigits}. I repeat, your verification code is: ${otpDigits}. This code expires in 10 minutes.</Say>
  <Pause length="1"/>
  <Say voice="alice" language="en-US">Thank you!</Say>
</Response>`;

  const call = await client.calls.create({
    to,
    from: fromNumber,
    twiml: twiml
  });
  
  return call.sid;
}