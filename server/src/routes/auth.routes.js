import express from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { generateOtp, otpExpiry } from '../utils/otp.js';
import { sendOtpEmail } from '../utils/mailer.js';
import { sendOtpSms, sendOtpCall } from '../utils/twilio.js';

const router = express.Router();

function signToken(user) {
  return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d'
  });
}

// Register: creates account, sends OTP via email, SMS, or voice call
router.post('/register', async (req, res) => {
  console.log('🔵 [REGISTER ROUTE HIT]', req.body);
  try {
    const { name, email, phone, password, channel } = req.body; // channel: 'email' | 'sms' | 'call'
    if (!name || !email || !phone || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    let user = await User.findOne({ email });
    
    // If user exists and is verified, return error
    if (user && user.isVerified) {
      console.log('❌ [REGISTER] User already exists and verified:', email);
      return res.status(409).json({ message: 'User already exists and is verified' });
    }

    // If user exists but not verified, update and resend OTP
    if (user && !user.isVerified) {
      await user.setPassword(password);
      user.name = name;
      user.phone = phone;
    } else {
      // Create new user
      user = new User({ name, email, phone, passwordHash: 'temp' });
      await user.setPassword(password);
    }

    const otp = generateOtp(6);
    user.otpCode = otp;
    user.otpChannel = channel || 'email';
    user.otpExpiresAt = otpExpiry(10);

    await user.save();

    // Send OTP via selected channel
    if (channel === 'email') {
      await sendOtpEmail({ to: email, otp });
    } else if (channel === 'sms') {
      await sendOtpSms({ to: phone, otp });
    } else if (channel === 'call') {
      await sendOtpCall({ to: phone, otp });
    } else {
      // Default to email
      await sendOtpEmail({ to: email, otp });
    }

    return res.status(201).json({ message: 'User created. OTP sent.', channel: user.otpChannel });
  } catch (err) {
    console.error('Register Error:', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Verify registration OTP
router.post('/verify', async (req, res) => {
  console.log('🔵 [VERIFY REGISTRATION OTP ROUTE HIT]', req.body);
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      console.log('❌ [VERIFY REG] User not found:', email);
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('📊 [VERIFY REG] Checking OTP for:', email);
    console.log('   Received OTP:', otp, '(type:', typeof otp + ')');
    console.log('   Stored OTP:', user.otpCode, '(type:', typeof user.otpCode + ')');
    console.log('   OTP Expires At:', user.otpExpiresAt);
    console.log('   Current Time:', new Date());

    if (!user.otpCode || !user.otpExpiresAt || user.otpExpiresAt < new Date()) {
      console.log('❌ [VERIFY REG] OTP expired or not set');
      return res.status(400).json({ message: 'OTP expired or not set' });
    }

    // Convert both to strings and trim whitespace for comparison
    const receivedOTP = String(otp).trim();
    const storedOTP = String(user.otpCode).trim();

    if (storedOTP !== receivedOTP) {
      console.log('❌ [VERIFY REG] Invalid OTP - Mismatch!');
      console.log('   Expected:', storedOTP);
      console.log('   Received:', receivedOTP);
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    console.log('✅ [VERIFY REG] OTP verified successfully!');

    user.isVerified = true;
    user.otpCode = undefined;
    user.otpExpiresAt = undefined;
    user.otpChannel = undefined;
    await user.save();

    const token = signToken(user);
    return res.json({ message: 'Verified', token });
  } catch (err) {
    console.error('❌ [VERIFY REG] Error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Login with password
router.post('/login/password', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'Invalid credentials' });
    if (!user.isVerified) return res.status(403).json({ message: 'Account not verified' });

    const ok = await user.comparePassword(password);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

    const token = signToken(user);
    return res.json({ message: 'Logged in', token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Request OTP login (single channel: email, sms, or call)
router.post('/login/otp/request', async (req, res) => {
  console.log('🟢 [LOGIN OTP REQUEST ROUTE HIT]', req.body);
  try {
    const { email, channel } = req.body; // 'email' | 'sms' | 'call'
    const user = await User.findOne({ email });
    if (!user) {
      console.log('❌ [LOGIN OTP] User not found:', email);
      return res.status(404).json({ message: 'User not found' });
    }
    if (!user.isVerified) {
      console.log('❌ [LOGIN OTP] Account not verified:', email);
      return res.status(403).json({ message: 'Account not verified' });
    }

    const otp = generateOtp(6);
    user.otpCode = otp;
    user.otpChannel = channel || 'email';
    user.otpExpiresAt = otpExpiry(10);
    await user.save();

    console.log(`📤 [LOGIN OTP] Sending OTP via ${channel} to ${email}`);
    
    // Send OTP via selected channel only
    if (channel === 'email') {
      await sendOtpEmail({ to: user.email, otp });
      console.log('✅ [LOGIN OTP] Email sent successfully');
    } else if (channel === 'sms') {
      await sendOtpSms({ to: user.phone, otp });
      console.log('✅ [LOGIN OTP] SMS sent successfully');
    } else if (channel === 'call') {
      await sendOtpCall({ to: user.phone, otp });
      console.log('✅ [LOGIN OTP] Voice call sent successfully');
    } else {
      // Default to email if channel not specified
      await sendOtpEmail({ to: user.email, otp });
      console.log('✅ [LOGIN OTP] Email sent successfully (default)');
    }

    return res.json({ 
      message: 'OTP sent', 
      channel: user.otpChannel
    });
  } catch (err) {
    console.error('OTP Request Error:', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Verify OTP login
router.post('/login/otp/verify', async (req, res) => {
  console.log('🔵 [VERIFY OTP ROUTE HIT]', req.body);
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      console.log('❌ [VERIFY OTP] User not found:', email);
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('📊 [VERIFY OTP] Checking OTP for:', email);
    console.log('   Received OTP:', otp, '(type:', typeof otp + ')');
    console.log('   Stored OTP:', user.otpCode, '(type:', typeof user.otpCode + ')');
    console.log('   OTP Expires At:', user.otpExpiresAt);
    console.log('   Current Time:', new Date());

    if (!user.otpCode || !user.otpExpiresAt || user.otpExpiresAt < new Date()) {
      console.log('❌ [VERIFY OTP] OTP expired or not set');
      return res.status(400).json({ message: 'OTP expired or not set' });
    }

    // Convert both to strings and trim whitespace for comparison
    const receivedOTP = String(otp).trim();
    const storedOTP = String(user.otpCode).trim();

    if (storedOTP !== receivedOTP) {
      console.log('❌ [VERIFY OTP] Invalid OTP - Mismatch!');
      console.log('   Expected:', storedOTP);
      console.log('   Received:', receivedOTP);
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    console.log('✅ [VERIFY OTP] OTP verified successfully!');

    user.otpCode = undefined;
    user.otpExpiresAt = undefined;
    user.otpChannel = undefined;
    await user.save();

    const token = signToken(user);
    return res.json({ message: 'Logged in', token });
  } catch (err) {
    console.error('❌ [VERIFY OTP] Error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

export default router;