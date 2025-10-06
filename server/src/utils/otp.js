import crypto from 'crypto';

export function generateOtp(length = 6) {
  // numeric OTP
  const max = Math.pow(10, length) - 1;
  const otp = (crypto.randomInt(0, max + 1)).toString().padStart(length, '0');
  return otp;
}

export function otpExpiry(minutes = 10) {
  return new Date(Date.now() + minutes * 60 * 1000);
}

export function maskEmail(email) {
  const [user, domain] = email.split('@');
  const maskedUser = user[0] + '***' + user.slice(-1);
  return `${maskedUser}@${domain}`;
}

export function maskPhone(phone) {
  // Mask phone number, showing only last 4 digits
  // Example: +1234567890 -> ******7890
  if (!phone || phone.length < 4) return '****';
  return '*'.repeat(phone.length - 4) + phone.slice(-4);
}