import React, { useState } from 'react';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [mode, setMode] = useState('password'); // 'password' | 'otp'
  const [channel, setChannel] = useState('email');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const loginPassword = async (e) => {
    e.preventDefault();
    setStatus('');
    setLoading(true);
    try {
      const { data } = await axios.post(`${API}/auth/login/password`, { email, password });
      setStatus('✅ Login successful!');
      
      // Store token if provided
      if (data.token) {
        localStorage.setItem('token', data.token);
        console.log('🔐 Token saved:', data.token);
      }
      
      // Optional: Redirect to dashboard after 2 seconds
      setTimeout(() => {
        console.log('✅ Redirecting to dashboard...');
        // window.location.href = '/dashboard'; // Uncomment when dashboard exists
      }, 2000);
    } catch (err) {
      setStatus(`❌ ${err.response?.data?.message || 'Error logging in'}`);
    } finally {
      setLoading(false);
    }
  };

  const requestOtp = async (selectedChannel) => {
    setStatus('');
    setLoading(true);
    const url = `${API}/auth/login/otp/request`;
    const payload = { email, channel: selectedChannel };
    console.log('🔍 [LOGIN OTP REQUEST]');
    console.log('URL:', url);
    console.log('Payload:', payload);
    try {
      const { data } = await axios.post(url, payload);
      console.log('✅ Response:', data);
      const channelName = selectedChannel === 'email' ? 'Email' : selectedChannel === 'sms' ? 'SMS' : 'Voice Call';
      setStatus(`✅ OTP sent via ${channelName}`);
      setChannel(selectedChannel); // Update current channel
    } catch (err) {
      console.error('❌ Error:', err.response?.data || err.message);
      setStatus(`❌ ${err.response?.data?.message || 'Error sending OTP'}`);
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    setStatus('');
    setLoading(true);
    try {
      const { data } = await axios.post(`${API}/auth/login/otp/verify`, { email, otp });
      setStatus('✅ Verified successfully! Login successful!');
      
      // Store token if provided
      if (data.token) {
        localStorage.setItem('token', data.token);
        console.log('🔐 Token saved:', data.token);
      }
      
      // Optional: Redirect to dashboard after 2 seconds
      setTimeout(() => {
        console.log('✅ Redirecting to dashboard...');
        // window.location.href = '/dashboard'; // Uncomment when dashboard exists
      }, 2000);
    } catch (err) {
      setStatus(`❌ ${err.response?.data?.message || 'Error verifying OTP'}`);
    } finally {
      setLoading(false);
    }
  };

  const containerStyle = {
    padding: '24px',
    maxWidth: '500px',
    margin: '0 auto',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  };

  const formStyle = {
    display: 'grid',
    gap: '16px',
  };

  const inputStyle = {
    padding: '12px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '16px',
  };

  const buttonStyle = {
    padding: '12px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    cursor: 'pointer',
  };

  const buttonDisabledStyle = {
    ...buttonStyle,
    backgroundColor: '#ccc',
    cursor: 'not-allowed',
  };

  const statusStyle = {
    color: status.includes('successful') ? 'green' : status.includes('Error') ? 'red' : 'blue',
    fontWeight: 'bold',
  };

  const radioStyle = {
    marginRight: '8px',
  };

  return (
    <div style={containerStyle}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Login</h2>

      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center', gap: '20px' }}>
        <label>
          <input
            type="radio"
            name="mode"
            value="password"
            checked={mode === 'password'}
            onChange={() => setMode('password')}
            style={radioStyle}
          />
          Password Login
        </label>
        <label>
          <input
            type="radio"
            name="mode"
            value="otp"
            checked={mode === 'otp'}
            onChange={() => setMode('otp')}
            style={radioStyle}
          />
          OTP Login
        </label>
      </div>

      {mode === 'password' ? (
        <form onSubmit={loginPassword} style={formStyle}>
          <input
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={inputStyle}
            type="email"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={inputStyle}
          />
          <button
            type="submit"
            disabled={loading}
            style={loading ? buttonDisabledStyle : buttonStyle}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      ) : (
        <div style={formStyle}>
          <input
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={inputStyle}
            type="email"
          />
          
          <div style={{ display: 'grid', gap: '12px', marginTop: '8px' }}>
            <button
              onClick={() => requestOtp('email')}
              disabled={loading || !email}
              style={{
                ...buttonStyle,
                backgroundColor: '#6c757d',
                opacity: loading || !email ? 0.6 : 1
              }}
            >
              📧 Send Email OTP
            </button>
            <button
              onClick={() => requestOtp('sms')}
              disabled={loading || !email}
              style={{
                ...buttonStyle,
                backgroundColor: '#007bff',
                opacity: loading || !email ? 0.6 : 1
              }}
            >
              📱 Send SMS OTP
            </button>
            <button
              onClick={() => requestOtp('call')}
              disabled={loading || !email}
              style={{
                ...buttonStyle,
                backgroundColor: '#28a745',
                opacity: loading || !email ? 0.6 : 1
              }}
            >
              📞 Send Voice Call OTP
            </button>
          </div>
          
          {status && (
            <div style={{ 
              padding: '12px', 
              backgroundColor: status.includes('Error') ? '#f8d7da' : '#d4edda',
              borderRadius: '4px',
              color: status.includes('Error') ? '#721c24' : '#155724',
              textAlign: 'center'
            }}>
              {status}
            </div>
          )}
          <form onSubmit={verifyOtp} style={formStyle}>
            <input
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              style={inputStyle}
            />
            <button
              type="submit"
              disabled={loading}
              style={loading ? buttonDisabledStyle : buttonStyle}
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </form>
        </div>
      )}

      {mode === 'password' && status && (
        <p style={statusStyle}>{status}</p>
      )}
    </div>
  );
}