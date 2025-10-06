import React, { useState } from 'react';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function VerifyPage() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [status, setStatus] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setStatus('');
    try {
      const { data } = await axios.post(`${API}/auth/verify`, { email, otp });
      setStatus(`Verified! Token: ${data.token.substring(0, 12)}...`);
    } catch (err) {
      setStatus(err.response?.data?.message || 'Error');
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>Verify Registration</h2>
      <form onSubmit={submit} style={{ display: 'grid', gap: 12, maxWidth: 420 }}>
        <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input placeholder="OTP" value={otp} onChange={(e) => setOtp(e.target.value)} required />
        <button type="submit">Verify</button>
      </form>
      <p>{status}</p>
    </div>
  );
}