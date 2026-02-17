import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&display=swap');

  .layout-root {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    font-family: 'DM Sans', sans-serif;
    color: #2c2417;
    background: #faf8f5;
  }

  .layout-header {
    background: #fffdf9;
    border-bottom: 1px solid #e8dfd0;
    box-shadow: 0 2px 12px rgba(44,36,23,0.04);
  }

  .layout-header-inner {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0.875rem 1.5rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .layout-logo {
    font-family: 'Instrument Serif', serif;
    font-size: 1.5rem;
    font-weight: 400;
    color: #2c2417;
    text-decoration: none;
    letter-spacing: -0.02em;
    transition: color 0.2s;
  }

  .layout-logo:hover { color: #7c6a52; }

  .layout-logo span { color: #a89070; font-style: italic; }

  .layout-nav {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  .layout-nav-a {
    padding: 0.5rem 0.85rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: #6b5d4e;
    text-decoration: none;
    border-radius: 10px;
    transition: color 0.2s, background 0.2s;
  }

  .layout-nav-a:hover {
    color: #2c2417;
    background: #f7f4ef;
  }

  .layout-btn {
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
    font-weight: 600;
    font-family: 'DM Sans', sans-serif;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.2s;
    border: none;
  }

  .layout-btn-outline {
    background: transparent;
    color: #6b5d4e;
    border: 1.5px solid #e2d8cb;
  }

  .layout-btn-outline:hover {
    background: #f7f4ef;
    border-color: #c4b49a;
    color: #2c2417;
  }

  .layout-btn-primary {
    background: #3d3022;
    color: #fffdf9;
    box-shadow: 0 2px 8px rgba(61,48,34,0.2);
  }

  .layout-btn-primary:hover {
    background: #5a4a38;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(61,48,34,0.25);
  }

  .layout-main {
    flex: 1;
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem 1.5rem 3rem;
    width: 100%;
    box-sizing: border-box;
  }

  .layout-footer {
    border-top: 1px solid #e8dfd0;
    background: #fffdf9;
    padding: 1.5rem 1.5rem;
    text-align: center;
    font-size: 0.8rem;
    color: #8a7d6b;
  }

  .layout-footer strong { color: #5a4a38; font-weight: 600; }
`;

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <style>{styles}</style>
      <div className="layout-root">
        <header className="layout-header">
          <div className="layout-header-inner">
            <Link to="/" className="layout-logo">Review <span>Platform</span></Link>
            <nav className="layout-nav">
              <Link to="/" className="layout-nav-a">Home</Link>
              {user?.role === 'user' && <Link to="/my-reviews" className="layout-nav-a">My Reviews</Link>}
              {user?.role === 'business' && <Link to="/my-businesses" className="layout-nav-a">My Businesses</Link>}
              {user?.role === 'admin' && <Link to="/admin" className="layout-nav-a">Admin</Link>}
              {user ? (
                <button type="button" onClick={handleLogout} className="layout-btn layout-btn-outline">Logout</button>
              ) : (
                <>
                  <Link to="/login" className="layout-nav-a">Login</Link>
                  <Link to="/register" className="layout-btn layout-btn-primary">Register</Link>
                </>
              )}
            </nav>
          </div>
        </header>
        <main className="layout-main">
          <Outlet />
        </main>
        <footer className="layout-footer">
          <strong>Review Platform</strong>
          <span style={{ margin: '0 0.4rem' }}>·</span>
          Rate local businesses and discover the best spots
        </footer>
      </div>
    </>
  );
}
