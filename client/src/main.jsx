import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import RegisterPage from './pages/RegisterPage.jsx'
import VerifyPage from './pages/VerifyPage.jsx'
import LoginPage from './pages/LoginPage.jsx'

function App() {
  return (
    <BrowserRouter>
      <nav style={{ display: 'flex', gap: 12 }}>
        <Link to="/register">Register</Link>
        <Link to="/verify">Verify</Link>
        <Link to="/login">Login</Link>
      </nav>
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify" element={<VerifyPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<RegisterPage />} />
      </Routes>
    </BrowserRouter>
  )
}

createRoot(document.getElementById('root')).render(<App />)