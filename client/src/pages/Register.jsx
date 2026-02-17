import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../api';
import { useAuth } from '../context/AuthContext';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&display=swap');

  .reg-root {
    font-family: 'DM Sans', sans-serif;
    color: #2c2417;
    min-height: 100vh;
    padding: 3rem 1.5rem 4rem;
    position: relative;
  }

  .reg-root::before {
    content: '';
    position: fixed;
    top: -30%;
    left: -10%;
    width: 480px;
    height: 480px;
    background: radial-gradient(circle, #d4c5a9 0%, transparent 68%);
    opacity: 0.4;
    pointer-events: none;
  }

  .reg-wrapper {
    position: relative;
    z-index: 1;
    max-width: 460px;
    margin: 0 auto;
  }

  .reg-eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: #8a7d6b;
    margin-bottom: 0.9rem;
    animation: regFadeUp 0.5s ease both;
  }

  .reg-eyebrow::before {
    content: '';
    width: 22px;
    height: 1px;
    background: #c4b49a;
  }

  .reg-headline {
    font-family: 'Instrument Serif', serif;
    font-size: clamp(2rem, 4vw, 2.6rem);
    font-weight: 400;
    color: #2c2417;
    margin: 0 0 0.5rem;
    animation: regFadeUp 0.55s ease 0.05s both;
  }

  .reg-headline em { font-style: italic; color: #7c6a52; }

  .reg-sub {
    font-size: 0.95rem;
    color: #8a7d6b;
    font-weight: 300;
    margin-bottom: 2rem;
    animation: regFadeUp 0.55s ease 0.1s both;
  }

  .reg-card {
    background: #fffdf9;
    border: 1px solid #e8dfd0;
    border-radius: 20px;
    padding: 2.25rem 2rem;
    box-shadow: 0 4px 24px rgba(44,36,23,0.07);
    animation: regFadeUp 0.6s ease 0.15s both;
  }

  .reg-divider {
    width: 32px;
    height: 2px;
    background: #a89070;
    margin-bottom: 1.75rem;
  }

  .reg-field { margin-bottom: 1.25rem; }

  .reg-label {
    display: block;
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #6b5d4e;
    margin-bottom: 0.5rem;
  }

  .reg-input,
  .reg-select {
    width: 100%;
    padding: 0.7rem 1rem;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.9rem;
    color: #2c2417;
    background: #f7f4ef;
    border: 1.5px solid #e2d8cb;
    border-radius: 10px;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
    box-sizing: border-box;
    -webkit-appearance: none;
    appearance: none;
  }

  .reg-select {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='11' height='11' viewBox='0 0 24 24' fill='none' stroke='%23a89070' stroke-width='2.5'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 12px center;
    padding-right: 2.25rem;
    cursor: pointer;
  }

  .reg-input::placeholder { color: #c4b49a; }

  .reg-input:focus,
  .reg-select:focus {
    border-color: #a89070;
    background: #fffdf9;
    box-shadow: 0 0 0 3px rgba(168,144,112,0.12);
  }

  .reg-error {
    background: rgba(185, 28, 28, 0.08);
    border: 1px solid rgba(185, 28, 28, 0.25);
    border-left: 3px solid #b91c1c;
    border-radius: 10px;
    padding: 0.75rem 1rem;
    font-size: 0.85rem;
    color: #991b1b;
    margin-bottom: 1.25rem;
    font-weight: 500;
  }

  .reg-btn {
    width: 100%;
    padding: 0.85rem 1.25rem;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.9rem;
    font-weight: 600;
    letter-spacing: 0.06em;
    color: #fffdf9;
    background: #3d3022;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    margin-top: 0.5rem;
    transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
    box-shadow: 0 4px 14px rgba(61,48,34,0.25);
  }

  .reg-btn:hover:not(:disabled) {
    background: #5a4a38;
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(61,48,34,0.3);
  }

  .reg-btn:active:not(:disabled) { transform: translateY(0); }

  .reg-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .reg-footer {
    margin-top: 1.5rem;
    text-align: center;
    font-size: 0.9rem;
    color: #6b5d4e;
  }

  .reg-footer a {
    color: #7c6a52;
    font-weight: 600;
    text-decoration: none;
    border-bottom: 1px solid transparent;
    transition: border-color 0.2s;
  }

  .reg-footer a:hover { border-bottom-color: #7c6a52; }

  @keyframes regFadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await auth.register({ name, email, password, role });
      login(data.user, data.token);
      navigate(data.user.role === 'business' ? '/my-businesses' : '/');
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="reg-root">
        <div className="reg-wrapper">
          <div className="reg-eyebrow">Join the community</div>
          <h1 className="reg-headline">Create your <em>account</em></h1>
          <p className="reg-sub">Sign up and start reviewing local businesses.</p>

          <div className="reg-card">
            <div className="reg-divider" />
            <form onSubmit={handleSubmit}>
              {error && (
                <div className="reg-error">⚠ {error}</div>
              )}

              <div className="reg-field">
                <label className="reg-label">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="reg-input"
                  placeholder="Your name"
                />
              </div>
              <div className="reg-field">
                <label className="reg-label">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="reg-input"
                  placeholder="you@example.com"
                />
              </div>
              <div className="reg-field">
                <label className="reg-label">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="reg-input"
                  placeholder="At least 6 characters"
                />
              </div>
              <div className="reg-field">
                <label className="reg-label">I am a</label>
                <select value={role} onChange={(e) => setRole(e.target.value)} className="reg-select">
                  <option value="user">User (review businesses)</option>
                  <option value="business">Business (add my business)</option>
                </select>
              </div>

              <button type="submit" disabled={loading} className="reg-btn">
                {loading ? 'Creating account…' : 'Create account'}
              </button>
            </form>

            <div className="reg-footer">
              Already have an account? <Link to="/login">Login</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
