import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { businesses } from '../api';

const CATEGORIES = ['Restaurant', 'Cafe', 'Shop', 'Services', 'Health', 'Other'];

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&display=swap');

  .biz-root { font-family: 'DM Sans', sans-serif; color: #2c2417; }

  .biz-eyebrow {
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: #8a7d6b;
    margin-bottom: 0.5rem;
  }

  .biz-title {
    font-family: 'Instrument Serif', serif;
    font-size: 1.85rem;
    font-weight: 400;
    color: #2c2417;
    margin: 0 0 0.35rem;
  }

  .biz-sub { font-size: 0.95rem; color: #8a7d6b; font-weight: 300; margin-bottom: 2rem; }

  .biz-form-card {
    background: #fffdf9;
    border: 1px solid #e8dfd0;
    border-radius: 20px;
    padding: 2rem;
    margin-bottom: 2.5rem;
    box-shadow: 0 4px 24px rgba(44,36,23,0.07);
  }

  .biz-form-title {
    font-family: 'Instrument Serif', serif;
    font-size: 1.35rem;
    color: #2c2417;
    margin: 0 0 1.5rem;
  }

  .biz-divider { width: 28px; height: 2px; background: #a89070; margin-bottom: 1.5rem; }

  .biz-field { margin-bottom: 1.25rem; }

  .biz-grid { display: grid; gap: 1.25rem; }
  @media (min-width: 640px) { .biz-grid { grid-template-columns: 1fr 1fr; } }

  .biz-label {
    display: block;
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #6b5d4e;
    margin-bottom: 0.5rem;
  }

  .biz-input,
  .biz-select,
  .biz-textarea {
    width: 100%;
    padding: 0.7rem 1rem;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.9rem;
    color: #2c2417;
    background: #f7f4ef;
    border: 1.5px solid #e2d8cb;
    border-radius: 10px;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
    box-sizing: border-box;
  }

  .biz-textarea { min-height: 72px; resize: vertical; }

  .biz-input:focus,
  .biz-select:focus,
  .biz-textarea:focus {
    border-color: #a89070;
    box-shadow: 0 0 0 3px rgba(168,144,112,0.12);
  }

  .biz-error {
    background: rgba(185,28,28,0.08);
    border: 1px solid rgba(185,28,28,0.25);
    border-left: 3px solid #b91c1c;
    border-radius: 10px;
    padding: 0.75rem 1rem;
    font-size: 0.85rem;
    color: #991b1b;
    margin-bottom: 1.25rem;
  }

  .biz-btn {
    padding: 0.75rem 1.5rem;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.9rem;
    font-weight: 600;
    color: #fffdf9;
    background: #3d3022;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    margin-top: 0.5rem;
    transition: background 0.2s, transform 0.15s;
  }

  .biz-btn:hover:not(:disabled) {
    background: #5a4a38;
    transform: translateY(-1px);
  }

  .biz-btn:disabled { opacity: 0.6; cursor: not-allowed; }

  .biz-loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 4rem 0;
    gap: 1rem;
  }

  .biz-loading-ring {
    width: 38px;
    height: 38px;
    border: 3px solid #e8dfd0;
    border-top-color: #7c6a52;
    border-radius: 50%;
    animation: bizSpin 0.8s linear infinite;
  }

  @keyframes bizSpin { to { transform: rotate(360deg); } }

  .biz-loading-text { font-size: 0.9rem; color: #a89070; }

  .biz-empty {
    background: #fffdf9;
    border: 1px solid #e8dfd0;
    border-radius: 20px;
    padding: 3rem 2rem;
    text-align: center;
    font-size: 0.95rem;
    color: #8a7d6b;
  }

  .biz-grid-cards {
    display: grid;
    gap: 1.5rem;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  }

  .biz-card {
    background: #fffdf9;
    border: 1px solid #e8dfd0;
    border-radius: 18px;
    overflow: hidden;
    transition: transform 0.22s, box-shadow 0.22s, border-color 0.22s;
    box-shadow: 0 2px 8px rgba(44,36,23,0.05);
  }

  .biz-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 32px rgba(44,36,23,0.1);
    border-color: #c4b49a;
  }

  .biz-card-media {
    aspect-ratio: 16/10;
    overflow: hidden;
    background: linear-gradient(135deg, #ede5d8 0%, #d8cfc0 100%);
  }

  .biz-card-media img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.35s; }
  .biz-card:hover .biz-card-media img { transform: scale(1.05); }

  .biz-card-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2.5rem;
    opacity: 0.4;
  }

  .biz-card-body { padding: 1.25rem 1.5rem; }

  .biz-card-name {
    font-family: 'Instrument Serif', serif;
    font-size: 1.15rem;
    color: #2c2417;
    margin: 0 0 0.35rem;
  }

  .biz-card-meta { font-size: 0.85rem; color: #8a7d6b; margin-bottom: 0.75rem; }

  .biz-card-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 0.75rem;
    border-top: 1px solid #f0e8dc;
  }

  .biz-card-rating { color: #c49a3c; font-weight: 700; }

  .biz-card-pending {
    font-size: 0.72rem;
    padding: 0.25rem 0.6rem;
    background: #f7f4ef;
    border-radius: 8px;
    color: #7c6a52;
    font-weight: 600;
  }

  .biz-card-link {
    font-size: 0.85rem;
    font-weight: 600;
    color: #7c6a52;
    text-decoration: none;
    border-bottom: 1px solid transparent;
    transition: border-color 0.2s;
  }

  .biz-card-link:hover { border-bottom-color: #7c6a52; }
`;

export default function MyBusinesses() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', location: '', category: 'Restaurant', description: '' });
  const [photo, setPhoto] = useState(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    businesses.myList()
      .then(setList)
      .catch(() => setList([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    setLoading(true);
    load();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    const fd = new FormData();
    fd.append('name', form.name);
    fd.append('location', form.location);
    fd.append('category', form.category);
    fd.append('description', form.description);
    if (photo) fd.append('photo', photo);
    try {
      await businesses.create(fd);
      setForm({ name: '', location: '', category: 'Restaurant', description: '' });
      setPhoto(null);
      load();
    } catch (err) {
      setError(err.message || 'Failed to add business');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="biz-root">
      <style>{styles}</style>
      <div className="biz-eyebrow">Business owner</div>
      <h1 className="biz-title">My Businesses</h1>
      <p className="biz-sub">Add and manage your listed businesses.</p>

      <div className="biz-form-card">
        <h2 className="biz-form-title">Add a business</h2>
        <div className="biz-divider" />
        <form onSubmit={handleSubmit}>
          {error && <div className="biz-error">⚠ {error}</div>}
          <div className="biz-grid">
            <div className="biz-field">
              <label className="biz-label">Name</label>
              <input
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                required
                className="biz-input"
                placeholder="Business name"
              />
            </div>
            <div className="biz-field">
              <label className="biz-label">Location</label>
              <input
                value={form.location}
                onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                required
                className="biz-input"
                placeholder="City or address"
              />
            </div>
            <div className="biz-field">
              <label className="biz-label">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                className="biz-select"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="biz-field">
              <label className="biz-label">Photo</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setPhoto(e.target.files?.[0] || null)}
                className="biz-input"
              />
            </div>
          </div>
          <div className="biz-field" style={{ marginTop: '1rem' }}>
            <label className="biz-label">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              rows={2}
              className="biz-textarea"
              placeholder="Short description (optional)"
            />
          </div>
          <button type="submit" disabled={submitting} className="biz-btn">
            {submitting ? 'Adding…' : 'Add business'}
          </button>
        </form>
      </div>

      {loading ? (
        <div className="biz-loading">
          <div className="biz-loading-ring" />
          <p className="biz-loading-text">Loading…</p>
        </div>
      ) : list.length === 0 ? (
        <div className="biz-empty">No businesses added yet. Add one using the form above.</div>
      ) : (
        <div className="biz-grid-cards">
          {list.map((b) => (
            <div key={b._id} className="biz-card">
              <div className="biz-card-media">
                {b.photo ? (
                  <img src={b.photo} alt={b.name} />
                ) : (
                  <div className="biz-card-placeholder">📷</div>
                )}
              </div>
              <div className="biz-card-body">
                <h2 className="biz-card-name">{b.name}</h2>
                <p className="biz-card-meta">{b.location} · {b.category}</p>
                <div className="biz-card-footer">
                  <span className="biz-card-rating">★ {Number(b.avgRating).toFixed(1)}</span>
                  {!b.approved && <span className="biz-card-pending">Pending approval</span>}
                  {b.approved && <Link to={'/business/' + b._id} className="biz-card-link">View</Link>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
