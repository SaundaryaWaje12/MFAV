# SMS Integration Guide - OTP via Email & SMS

## 🎯 Overview

The application has been modified to send OTP via **Email** and **SMS** (instead of voice call). Users can now choose between:
- **Email OTP** - Sent via SMTP (Nodemailer)
- **SMS OTP** - Sent via Twilio SMS API

---

## 📝 Changes Made

### 1. **Modified Files**

#### `src/utils/twilio.js`
- ✅ Replaced `callOtp()` function with `sendOtpSms()`
- ✅ Uses Twilio Messages API to send SMS
- ✅ SMS format: "Your verification code is {OTP}. It expires in 10 minutes. Do not share this code with anyone."

#### `src/routes/auth.routes.js`
- ✅ Updated import from `callOtp` to `sendOtpSms`
- ✅ Changed channel from `'call'` to `'sms'`
- ✅ Updated comments to reflect SMS instead of voice call
- ✅ Both `/register` and `/login/otp/request` endpoints now support SMS

#### `src/models/User.js`
- ✅ Updated `otpChannel` enum from `['email', 'call']` to `['email', 'sms']`

#### `src/utils/otp.js`
- ✅ Added `maskPhone()` utility function for phone number masking (security)

#### `.env`
- ✅ Added proper configuration sections
- ✅ Added JWT, SMTP, and Twilio configurations
- ✅ Renamed `TWILIO_CALLER_ID` to `TWILIO_PHONE_NUMBER` for clarity

---

## 🔧 Configuration

### 1. **Twilio Setup**

You need a Twilio account with SMS capabilities:

1. Sign up at [Twilio Console](https://console.twilio.com/)
2. Get your credentials:
   - **Account SID**: `AC386c57c8604c8be76d6264e7f89419d4` (already configured)
   - **Auth Token**: `6de988a45bdc59e93b8f4cca1e4525ba` (already configured)
   - **Phone Number**: `+14195154252` (already configured)

3. Make sure your Twilio phone number has SMS capabilities enabled

### 2. **Environment Variables**

Update your `.env` file with the following:

```env
# Twilio Configuration (for SMS)
TWILIO_ACCOUNT_SID=AC386c57c8604c8be76d6264e7f89419d4
TWILIO_AUTH_TOKEN=6de988a45bdc59e93b8f4cca1e4525ba
TWILIO_PHONE_NUMBER=+14195154252

# Email Configuration (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FROM_EMAIL=no-reply@yourdomain.com

# JWT Configuration
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=1d
```

### 3. **SMTP Configuration (for Email OTP)**

For Gmail:
1. Enable 2-Factor Authentication
2. Generate an App Password: [Google App Passwords](https://myaccount.google.com/apppasswords)
3. Use the app password in `SMTP_PASS`

---

## 🚀 API Usage

### 1. **Register with OTP**

**Endpoint:** `POST /api/auth/register`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "password": "SecurePass123",
  "channel": "sms"
}
```

**Channel Options:**
- `"email"` - Send OTP via email
- `"sms"` - Send OTP via SMS

**Response:**
```json
{
  "message": "User created. OTP sent.",
  "channel": "sms"
}
```

---

### 2. **Verify OTP**

**Endpoint:** `POST /api/auth/verify`

**Request Body:**
```json
{
  "email": "john@example.com",
  "otp": "123456"
}
```

**Response:**
```json
{
  "message": "Verified",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### 3. **Login with OTP (Request)**

**Endpoint:** `POST /api/auth/login/otp/request`

**Request Body:**
```json
{
  "email": "john@example.com",
  "channel": "sms"
}
```

**Response:**
```json
{
  "message": "OTP sent",
  "channel": "sms"
}
```

---

### 4. **Login with OTP (Verify)**

**Endpoint:** `POST /api/auth/login/otp/verify`

**Request Body:**
```json
{
  "email": "john@example.com",
  "otp": "123456"
}
```

**Response:**
```json
{
  "message": "Logged in",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## 🧪 Testing with cURL

### Test SMS OTP (Register)
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "+1234567890",
    "password": "Test123!",
    "channel": "sms"
  }'
```

### Test Email OTP (Register)
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "+1234567890",
    "password": "Test123!",
    "channel": "email"
  }'
```

### Verify OTP
```bash
curl -X POST http://localhost:5000/api/auth/verify \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "otp": "123456"
  }'
```

---

## 📱 Twilio SMS API Reference

The implementation uses the following Twilio API call:

```javascript
const message = await client.messages.create({
  body: `Your verification code is ${otp}. It expires in 10 minutes.`,
  to: '+1234567890',
  from: process.env.TWILIO_PHONE_NUMBER
});
```

This corresponds to the cURL command:
```bash
curl 'https://api.twilio.com/2010-04-01/Accounts/AC386c57c8604c8be76d6264e7f89419d4/Messages.json' \
  -X POST \
  --data-urlencode 'To=+1234567890' \
  --data-urlencode 'From=+14195154252' \
  --data-urlencode 'Body=Your verification code is 123456. It expires in 10 minutes.' \
  -u AC386c57c8604c8be76d6264e7f89419d4:[AuthToken]
```

---

## 🔒 Security Features

1. **OTP Expiry**: OTPs expire after 10 minutes
2. **Phone Masking**: Added `maskPhone()` utility to mask phone numbers in logs/responses
3. **Secure Message**: SMS includes warning not to share the code
4. **One-time Use**: OTP is cleared from database after successful verification

---

## 🐛 Troubleshooting

### SMS Not Sending
1. Check Twilio credentials in `.env`
2. Verify phone number format (must include country code, e.g., `+1234567890`)
3. Check Twilio account balance
4. Verify phone number is verified in Twilio (for trial accounts)

### Email Not Sending
1. Check SMTP credentials in `.env`
2. For Gmail, ensure App Password is used (not regular password)
3. Check firewall/network settings for port 587

### OTP Verification Fails
1. Check OTP hasn't expired (10 minutes)
2. Verify OTP code matches exactly
3. Check database connection

---

## 📦 Dependencies

All required dependencies are already installed:
- `twilio`: ^5.3.3 (for SMS)
- `nodemailer`: ^6.9.13 (for Email)
- `express`: ^4.19.2
- `mongoose`: ^8.6.0
- `jsonwebtoken`: ^9.0.2
- `bcryptjs`: ^2.4.3

---

## 🎉 Summary

✅ Voice call OTP replaced with SMS OTP  
✅ Email OTP functionality retained  
✅ User can choose between Email or SMS  
✅ Twilio SMS API integrated  
✅ Environment variables configured  
✅ Security features added  
✅ API endpoints updated  

The system is now ready to send OTP via **Email & SMS**!