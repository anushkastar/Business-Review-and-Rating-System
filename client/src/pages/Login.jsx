import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../api';
import { useAuth } from '../context/AuthContext';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&display=swap');

  .login-root {
    min-height: 100vh;
    background-color: #0a0a0a;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'DM Sans', sans-serif;
    position: relative;
    overflow: hidden;
    padding: 24px;
  }

  /* Geometric background shapes */
  .login-root::before {
    content: '';
    position: fixed;
    top: -120px;
    right: -120px;
    width: 480px;
    height: 480px;
    background: radial-gradient(circle, rgba(255, 107, 0, 0.18) 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
  }

  .login-root::after {
    content: '';
    position: fixed;
    bottom: -80px;
    left: -80px;
    width: 360px;
    height: 360px;
    background: radial-gradient(circle, rgba(255, 107, 0, 0.10) 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
  }

  .login-grid-bg {
    position: fixed;
    inset: 0;
    background-image:
      linear-gradient(rgba(255, 107, 0, 0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 107, 0, 0.04) 1px, transparent 1px);
    background-size: 48px 48px;
    pointer-events: none;
    z-index: 0;
  }

  .login-wrapper {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 460px;
  }

  /* Brand header */
  .login-brand {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 36px;
    animation: fadeSlideDown 0.5s ease both;
  }

  .login-brand-icon {
    width: 38px;
    height: 38px;
    background: #ff6b00;
    display: flex;
    align-items: center;
    justify-content: center;
    clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
  }

  .login-brand-icon svg {
    width: 20px;
    height: 20px;
    fill: #0a0a0a;
  }

  .login-brand-name {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 22px;
    color: #ffffff;
    letter-spacing: 2px;
  }

  .login-brand-name span {
    color: #ff6b00;
  }

  /* Card */
  .login-card {
    background: #111111;
    border: 1px solid rgba(255, 107, 0, 0.2);
    border-radius: 4px;
    padding: 44px 40px;
    position: relative;
    overflow: hidden;
    animation: fadeSlideUp 0.55s ease 0.1s both;
    box-shadow:
      0 0 0 1px rgba(255,107,0,0.05),
      0 32px 64px rgba(0,0,0,0.6),
      0 0 80px rgba(255,107,0,0.05);
  }

  /* Orange corner accent */
  .login-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 120px;
    height: 3px;
    background: linear-gradient(90deg, #ff6b00, transparent);
  }

  .login-card::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 3px;
    height: 80px;
    background: linear-gradient(180deg, #ff6b00, transparent);
  }

  /* Headings */
  .login-headline {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 42px;
    color: #ffffff;
    letter-spacing: 3px;
    line-height: 1;
    margin-bottom: 6px;
  }

  .login-headline span {
    color: #ff6b00;
  }

  .login-subtext {
    font-size: 13px;
    color: #666666;
    letter-spacing: 0.3px;
    margin-bottom: 36px;
    font-weight: 300;
  }

  /* Divider */
  .login-divider {
    width: 32px;
    height: 2px;
    background: #ff6b00;
    margin-bottom: 32px;
  }

  /* Form fields */
  .login-field {
    margin-bottom: 20px;
  }

  .login-label {
    display: block;
    font-size: 11px;
    font-weight: 600;
    color: #888888;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    margin-bottom: 8px;
  }

  .login-input {
    width: 100%;
    background: #0a0a0a;
    border: 1px solid #2a2a2a;
    border-radius: 3px;
    padding: 13px 16px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    color: #ffffff;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
    box-sizing: border-box;
  }

  .login-input::placeholder {
    color: #333333;
  }

  .login-input:focus {
    border-color: #ff6b00;
    box-shadow: 0 0 0 3px rgba(255, 107, 0, 0.12);
  }

  /* Error */
  .login-error {
    background: rgba(255, 60, 0, 0.08);
    border: 1px solid rgba(255, 60, 0, 0.3);
    border-left: 3px solid #ff3c00;
    border-radius: 3px;
    padding: 12px 14px;
    font-size: 13px;
    color: #ff7755;
    margin-bottom: 24px;
    font-weight: 500;
  }

  /* Submit button */
  .login-btn {
    width: 100%;
    background: #ff6b00;
    color: #000000;
    border: none;
    border-radius: 3px;
    padding: 14px;
    font-family: 'Bebas Neue', sans-serif;
    font-size: 18px;
    letter-spacing: 2.5px;
    cursor: pointer;
    margin-top: 10px;
    position: relative;
    overflow: hidden;
    transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
    box-shadow: 0 4px 20px rgba(255, 107, 0, 0.35);
  }

  .login-btn::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 50%);
    pointer-events: none;
  }

  .login-btn:hover:not(:disabled) {
    background: #ff8c00;
    transform: translateY(-1px);
    box-shadow: 0 8px 30px rgba(255, 107, 0, 0.5);
  }

  .login-btn:active:not(:disabled) {
    transform: translateY(0);
  }

  .login-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .login-btn-spinner {
    display: inline-block;
    width: 14px;
    height: 14px;
    border: 2px solid rgba(0,0,0,0.3);
    border-top-color: #000;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
    vertical-align: middle;
    margin-right: 8px;
  }

  /* Footer */
  .login-footer {
    margin-top: 28px;
    text-align: center;
    font-size: 13px;
    color: #555555;
  }

  .login-footer a {
    color: #ff6b00;
    font-weight: 600;
    text-decoration: none;
    border-bottom: 1px solid transparent;
    transition: border-color 0.2s;
  }

  .login-footer a:hover {
    border-bottom-color: #ff6b00;
  }

  /* Bottom tag line */
  .login-tagline {
    margin-top: 32px;
    text-align: center;
    font-size: 11px;
    color: #333333;
    letter-spacing: 1px;
    text-transform: uppercase;
    animation: fadeSlideUp 0.6s ease 0.3s both;
  }

  /* Animations */
  @keyframes fadeSlideDown {
    from { opacity: 0; transform: translateY(-16px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @keyframes fadeSlideUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await auth.login({ email, password });
      login(data.user, data.token);
      navigate(data.user.role === 'admin' ? '/admin' : '/');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="login-root">
        <div className="login-grid-bg" />

        <div className="login-wrapper">
          {/* Brand */}
          <div className="login-brand">
            <div className="login-brand-icon">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/>
              </svg>
            </div>
            <div className="login-brand-name">RATE<span>SPOT</span></div>
          </div>

          {/* Card */}
          <div className="login-card">
            <h1 className="login-headline">WELCOME <span>BACK</span></h1>
            <p className="login-subtext">Sign in to access your account</p>
            <div className="login-divider" />

            <form onSubmit={handleSubmit}>
              {error && (
                <div className="login-error">
                  ⚠ {error}
                </div>
              )}

              <div className="login-field">
                <label className="login-label">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="login-input"
                  placeholder="you@example.com"
                />
              </div>

              <div className="login-field">
                <label className="login-label">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="login-input"
                  placeholder="••••••••"
                />
              </div>

              <button type="submit" disabled={loading} className="login-btn">
                {loading && <span className="login-btn-spinner" />}
                {loading ? 'SIGNING IN...' : 'SIGN IN'}
              </button>
            </form>

            <div className="login-footer">
              Don't have an account?{' '}
              <Link to="/register">Create one</Link>
            </div>
          </div>

          <p className="login-tagline">Trusted reviews · Real people · Real experiences</p>
        </div>
      </div>
    </>
  );
}
