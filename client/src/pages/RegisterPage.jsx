import React, { useState } from 'react';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('register'); // 'register' or 'verify'
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState('');

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const getOtp = async (channel) => {
    setStatus('');
    setLoading(true);
    setSelectedChannel(channel);
    try {
      const { data } = await axios.post(`${API}/auth/register`, { ...form, channel });
      const channelName = channel === 'email' ? 'Email' : channel === 'sms' ? 'SMS' : 'Voice Call';
      setStatus(`✅ OTP sent via ${channelName}`);
      setStep('verify');
    } catch (err) {
      setStatus(`❌ ${err.response?.data?.message || 'Error'}`);
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    setStatus('');
    setLoading(true);
    try {
      const { data } = await axios.post(`${API}/auth/verify`, { email: form.email, otp });
      setStatus('Registration successful! You are now verified.');
      // Optionally, store token or redirect
    } catch (err) {
      setStatus(err.response?.data?.message || 'Error');
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    setStatus('');
    setLoading(true);
    try {
      const { data } = await axios.post(`${API}/auth/register`, { ...form, channel: selectedChannel });
      const channelName = selectedChannel === 'email' ? 'Email' : selectedChannel === 'sms' ? 'SMS' : 'Voice Call';
      setStatus(`✅ OTP resent via ${channelName}`);
    } catch (err) {
      setStatus(`❌ ${err.response?.data?.message || 'Error'}`);
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
    padding: '12px',
    borderRadius: '4px',
    marginTop: '10px',
    textAlign: 'center',
    fontWeight: 'bold',
    backgroundColor: status.includes('✅') ? '#d4edda' : status.includes('❌') ? '#f8d7da' : '#d1ecf1',
    color: status.includes('✅') ? '#155724' : status.includes('❌') ? '#721c24' : '#0c5460',
  };

  return (
    <div style={containerStyle}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Register</h2>
      {step === 'register' && (
        <div style={formStyle}>
          <input
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={onChange}
            required
            style={inputStyle}
          />
          <input
            name="email"
            type="email"
            placeholder="Email Address"
            value={form.email}
            onChange={onChange}
            required
            style={inputStyle}
          />
          <input
            name="phone"
            placeholder="Phone Number (e.g., +917499128843)"
            value={form.phone}
            onChange={onChange}
            required
            style={inputStyle}
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={onChange}
            required
            style={inputStyle}
          />
          
          <div style={{ marginTop: '10px' }}>
            <p style={{ textAlign: 'center', fontWeight: 'bold', marginBottom: '10px' }}>
              Choose OTP Delivery Method:
            </p>
            <div style={{ display: 'grid', gap: '10px' }}>
              <button
                type="button"
                onClick={() => getOtp('email')}
                disabled={loading || !form.name || !form.email || !form.phone || !form.password}
                style={{
                  ...buttonStyle,
                  backgroundColor: (loading || !form.name || !form.email || !form.phone || !form.password) ? '#ccc' : '#6c757d',
                  cursor: (loading || !form.name || !form.email || !form.phone || !form.password) ? 'not-allowed' : 'pointer',
                }}
              >
                📧 Send Email OTP
              </button>
              <button
                type="button"
                onClick={() => getOtp('sms')}
                disabled={loading || !form.name || !form.email || !form.phone || !form.password}
                style={{
                  ...buttonStyle,
                  backgroundColor: (loading || !form.name || !form.email || !form.phone || !form.password) ? '#ccc' : '#007bff',
                  cursor: (loading || !form.name || !form.email || !form.phone || !form.password) ? 'not-allowed' : 'pointer',
                }}
              >
                📱 Send SMS OTP
              </button>
              <button
                type="button"
                onClick={() => getOtp('call')}
                disabled={loading || !form.name || !form.email || !form.phone || !form.password}
                style={{
                  ...buttonStyle,
                  backgroundColor: (loading || !form.name || !form.email || !form.phone || !form.password) ? '#ccc' : '#28a745',
                  cursor: (loading || !form.name || !form.email || !form.phone || !form.password) ? 'not-allowed' : 'pointer',
                }}
              >
                📞 Send Voice Call OTP
              </button>
            </div>
          </div>
        </div>
      )}
      {step === 'verify' && (
        <form onSubmit={verifyOtp} style={formStyle}>
          <p style={{ textAlign: 'center' }}>
            OTP has been sent via {selectedChannel === 'email' ? 'Email' : selectedChannel === 'sms' ? 'SMS' : 'Voice Call'} to {selectedChannel === 'email' ? form.email : form.phone}.
          </p>
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
          <div style={{ textAlign: 'center', marginTop: '10px' }}>
            <p>Didn't receive the {selectedChannel === 'email' ? 'email' : selectedChannel === 'sms' ? 'SMS' : 'call'}?</p>
            <button
              type="button"
              onClick={resendOtp}
              disabled={loading}
              style={{
                ...buttonStyle,
                backgroundColor: '#28a745',
                marginTop: '8px',
              }}
            >
              Resend OTP
            </button>
          </div>
        </form>
      )}
      {status && <p style={statusStyle}>{status}</p>}
    </div>
  );
}