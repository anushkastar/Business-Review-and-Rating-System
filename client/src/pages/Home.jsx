import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { businesses } from '../api';

const CATEGORIES = ['Restaurant', 'Cafe', 'Shop', 'Services', 'Health', 'Other'];

const CATEGORY_ICONS = {
  Restaurant: '🍽',
  Cafe: '☕',
  Shop: '🛍',
  Services: '🔧',
  Health: '🌿',
  Other: '✦',
};

const EMPTY_ICONS = ['🏪', '🏬', '🏢'];

export default function Home() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [sort, setSort] = useState('rating');

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (category) params.category = category;
    if (location) params.location = location;
    if (sort) params.sort = sort;
    businesses.list(params)
      .then(setList)
      .catch(() => setList([]))
      .finally(() => setLoading(false));
  }, [category, location, sort]);

  const renderStars = (rating) => {
    const r = Math.round(Number(rating) * 2) / 2;
    return [1, 2, 3, 4, 5].map((i) => (
      <span key={i} style={{ color: i <= r ? '#c49a3c' : '#e2d8cb', fontSize: '0.85rem' }}>★</span>
    ));
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,300&display=swap');

        .home-root {
          font-family: 'DM Sans', sans-serif;
          color: #2c2417;
          min-height: 100vh;
        }

        /* ── Hero ── */
        .home-hero {
          position: relative;
          padding: 3.5rem 0 2rem;
          overflow: hidden;
        }

        .home-hero::before {
          content: '';
          position: absolute;
          top: -40%;
          right: -5%;
          width: 520px;
          height: 520px;
          background: radial-gradient(circle, #d4c5a9 0%, transparent 68%);
          opacity: 0.5;
          pointer-events: none;
        }

        .home-hero-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #8a7d6b;
          margin-bottom: 0.9rem;
          animation: fadeUp 0.5s ease both;
        }

        .home-hero-eyebrow::before {
          content: '';
          width: 22px;
          height: 1px;
          background: #c4b49a;
        }

        .home-hero-title {
          font-family: 'Instrument Serif', serif;
          font-size: clamp(2.2rem, 5vw, 3.2rem);
          font-weight: 400;
          line-height: 1.15;
          letter-spacing: -0.01em;
          color: #2c2417;
          margin: 0 0 0.75rem;
          animation: fadeUp 0.55s ease 0.05s both;
        }

        .home-hero-title em {
          font-style: italic;
          color: #7c6a52;
        }

        .home-hero-sub {
          font-size: 0.95rem;
          color: #8a7d6b;
          font-weight: 300;
          max-width: 420px;
          line-height: 1.65;
          animation: fadeUp 0.55s ease 0.1s both;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ── Filter bar ── */
        .home-filters {
          background: #fffdf9;
          border: 1px solid #e8dfd0;
          border-radius: 20px;
          padding: 1.5rem 1.75rem;
          margin-bottom: 2.5rem;
          box-shadow: 0 4px 24px rgba(44,36,23,0.07);
          display: flex;
          flex-wrap: wrap;
          gap: 1.25rem;
          align-items: flex-end;
          animation: fadeUp 0.6s ease 0.15s both;
        }

        .home-filter-group {
          display: flex;
          flex-direction: column;
          gap: 0.38rem;
          flex: 1;
          min-width: 130px;
        }

        .home-filter-label {
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #6b5d4e;
        }

        .home-filter-input-wrap {
          position: relative;
        }

        .home-filter-icon {
          position: absolute;
          left: 11px;
          top: 50%;
          transform: translateY(-50%);
          width: 14px;
          height: 14px;
          color: #b8a898;
          pointer-events: none;
        }

        .home-filter-input,
        .home-filter-select {
          width: 100%;
          padding: 0.65rem 0.8rem 0.65rem 2.2rem;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.87rem;
          color: #2c2417;
          background: #f7f4ef;
          border: 1.5px solid #e2d8cb;
          border-radius: 10px;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
          -webkit-appearance: none;
          appearance: none;
          box-sizing: border-box;
        }

        .home-filter-input::placeholder { color: #c4b49a; font-weight: 300; }

        .home-filter-input:focus,
        .home-filter-select:focus {
          border-color: #a89070;
          background: #fffdf9;
          box-shadow: 0 0 0 3px rgba(168,144,112,0.12);
        }

        .home-filter-select {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='11' height='11' viewBox='0 0 24 24' fill='none' stroke='%23a89070' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 10px center;
          padding-right: 2rem;
          cursor: pointer;
        }

        /* Category pill strip */
        .home-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 2.25rem;
          animation: fadeUp 0.6s ease 0.2s both;
        }

        .home-pill {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 0.38rem 0.85rem;
          font-size: 0.8rem;
          font-weight: 500;
          border-radius: 999px;
          border: 1.5px solid #e2d8cb;
          background: #fffdf9;
          color: #6b5d4e;
          cursor: pointer;
          transition: all 0.18s ease;
          white-space: nowrap;
        }

        .home-pill:hover {
          border-color: #a89070;
          color: #3d3022;
          background: #f7f4ef;
        }

        .home-pill.active {
          background: #3d3022;
          border-color: #3d3022;
          color: #fffdf9;
        }

        .home-pill-emoji { font-size: 0.85rem; }

        /* ── Section header ── */
        .home-section-head {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          margin-bottom: 1.5rem;
          animation: fadeUp 0.6s ease 0.25s both;
        }

        .home-section-title {
          font-family: 'Instrument Serif', serif;
          font-size: 1.5rem;
          font-weight: 400;
          color: #2c2417;
        }

        .home-section-count {
          font-size: 0.8rem;
          color: #a89070;
          font-weight: 400;
        }

        /* ── Grid ── */
        .home-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1.5rem;
        }

        /* ── Card ── */
        .home-card {
          background: #fffdf9;
          border: 1px solid #e8dfd0;
          border-radius: 18px;
          overflow: hidden;
          text-decoration: none;
          display: block;
          transition: transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease;
          box-shadow: 0 2px 8px rgba(44,36,23,0.05);
          animation: fadeUp 0.55s ease both;
        }

        .home-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 40px rgba(44,36,23,0.13);
          border-color: #c4b49a;
        }

        .home-card-media {
          position: relative;
          aspect-ratio: 16/10;
          overflow: hidden;
          background: linear-gradient(135deg, #ede5d8 0%, #d8cfc0 100%);
        }

        .home-card-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }

        .home-card:hover .home-card-img {
          transform: scale(1.06);
        }

        .home-card-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2.8rem;
          opacity: 0.4;
        }

        .home-card-badge {
          position: absolute;
          top: 10px;
          right: 10px;
          padding: 0.28rem 0.65rem;
          background: rgba(255,253,249,0.92);
          backdrop-filter: blur(6px);
          border-radius: 999px;
          font-size: 0.72rem;
          font-weight: 600;
          color: #5a4a38;
          letter-spacing: 0.04em;
          border: 1px solid rgba(196,180,154,0.5);
        }

        .home-card-body {
          padding: 1.1rem 1.25rem 1.25rem;
        }

        .home-card-name {
          font-family: 'Instrument Serif', serif;
          font-size: 1.15rem;
          font-weight: 400;
          color: #2c2417;
          margin: 0 0 0.3rem;
          transition: color 0.18s;
          line-height: 1.3;
        }

        .home-card:hover .home-card-name { color: #7c6a52; }

        .home-card-meta {
          font-size: 0.8rem;
          color: #a89070;
          font-weight: 400;
          display: flex;
          align-items: center;
          gap: 5px;
          margin-bottom: 0.85rem;
        }

        .home-card-meta-dot {
          width: 3px;
          height: 3px;
          border-radius: 50%;
          background: #c4b49a;
          flex-shrink: 0;
        }

        .home-card-rating {
          display: flex;
          align-items: center;
          gap: 6px;
          padding-top: 0.85rem;
          border-top: 1px solid #f0e8dc;
        }

        .home-card-stars {
          display: flex;
          gap: 1px;
        }

        .home-card-score {
          font-size: 0.85rem;
          font-weight: 700;
          color: #2c2417;
          margin-left: 2px;
        }

        .home-card-reviews {
          font-size: 0.75rem;
          color: #b8a898;
          font-weight: 400;
        }

        /* ── Loading ── */
        .home-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 5rem 0;
          gap: 1rem;
          animation: fadeUp 0.4s ease both;
        }

        .home-loading-ring {
          width: 38px;
          height: 38px;
          border: 3px solid #e8dfd0;
          border-top-color: #7c6a52;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        .home-loading-text {
          font-size: 0.9rem;
          color: #a89070;
          font-weight: 300;
          letter-spacing: 0.04em;
        }

        /* ── Empty ── */
        .home-empty {
          background: #fffdf9;
          border: 1px solid #e8dfd0;
          border-radius: 20px;
          padding: 4rem 2rem;
          text-align: center;
          animation: fadeUp 0.5s ease both;
        }

        .home-empty-icon {
          font-size: 2.5rem;
          margin-bottom: 1rem;
          opacity: 0.5;
        }

        .home-empty-title {
          font-family: 'Instrument Serif', serif;
          font-size: 1.4rem;
          font-weight: 400;
          color: #5a4a38;
          margin-bottom: 0.5rem;
        }

        .home-empty-sub {
          font-size: 0.88rem;
          color: #a89070;
          font-weight: 300;
        }

        /* Stagger animation for cards */
        .home-card:nth-child(1)  { animation-delay: 0.05s; }
        .home-card:nth-child(2)  { animation-delay: 0.10s; }
        .home-card:nth-child(3)  { animation-delay: 0.15s; }
        .home-card:nth-child(4)  { animation-delay: 0.20s; }
        .home-card:nth-child(5)  { animation-delay: 0.25s; }
        .home-card:nth-child(6)  { animation-delay: 0.30s; }
        .home-card:nth-child(n+7){ animation-delay: 0.32s; }
      `}</style>

      <div className="home-root">

        {/* Hero */}
        <div className="home-hero">
          <div className="home-hero-eyebrow">Local discovery</div>
          <h1 className="home-hero-title">
            Find the <em>best places</em><br />around you
          </h1>
          <p className="home-hero-sub">
            Explore community-reviewed restaurants, cafés, shops and more — all in one place.
          </p>
        </div>

        {/* Filter bar */}
        <div className="home-filters">
          {/* Location */}
          <div className="home-filter-group">
            <label className="home-filter-label">Location</label>
            <div className="home-filter-input-wrap">
              <svg className="home-filter-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 10c0 6-8 13-8 13s-8-7-8-13a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
              </svg>
              <input
                type="text"
                placeholder="City or area"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="home-filter-input"
              />
            </div>
          </div>

          {/* Category */}
          <div className="home-filter-group">
            <label className="home-filter-label">Category</label>
            <div className="home-filter-input-wrap">
              <svg className="home-filter-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
              </svg>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="home-filter-select"
              >
                <option value="">All categories</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{CATEGORY_ICONS[c]} {c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Sort */}
          <div className="home-filter-group">
            <label className="home-filter-label">Sort by</label>
            <div className="home-filter-input-wrap">
              <svg className="home-filter-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 6h18M7 12h10M11 18h2"/>
              </svg>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="home-filter-select"
              >
                <option value="rating">Top rated</option>
                <option value="reviews">Most reviewed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category pill strip */}
        <div className="home-pills">
          <button
            className={`home-pill${category === '' ? ' active' : ''}`}
            onClick={() => setCategory('')}
          >
            ✦ All
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c}
              className={`home-pill${category === c ? ' active' : ''}`}
              onClick={() => setCategory(c)}
            >
              <span className="home-pill-emoji">{CATEGORY_ICONS[c]}</span>
              {c}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="home-loading">
            <div className="home-loading-ring" />
            <p className="home-loading-text">Discovering local spots…</p>
          </div>
        ) : list.length === 0 ? (
          <div className="home-empty">
            <div className="home-empty-icon">🔍</div>
            <p className="home-empty-title">Nothing found here</p>
            <p className="home-empty-sub">Try adjusting your filters or exploring a different area.</p>
          </div>
        ) : (
          <>
            <div className="home-section-head">
              <h2 className="home-section-title">
                {category ? `${CATEGORY_ICONS[category]} ${category}` : 'All Businesses'}
              </h2>
              <span className="home-section-count">
                {list.length} {list.length === 1 ? 'place' : 'places'} found
              </span>
            </div>

            <div className="home-grid">
              {list.map((b, idx) => (
                <Link
                  key={b._id}
                  to={'/business/' + b._id}
                  className="home-card"
                >
                  <div className="home-card-media">
                    {b.photo ? (
                      <img src={b.photo} alt={b.name} className="home-card-img" />
                    ) : (
                      <div className="home-card-placeholder">
                        {CATEGORY_ICONS[b.category] || '🏪'}
                      </div>
                    )}
                    <div className="home-card-badge">
                      {b.category}
                    </div>
                  </div>

                  <div className="home-card-body">
                    <h2 className="home-card-name">{b.name}</h2>
                    <div className="home-card-meta">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 10c0 6-8 13-8 13s-8-7-8-13a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
                      </svg>
                      {b.location}
                    </div>

                    <div className="home-card-rating">
                      <div className="home-card-stars">
                        {renderStars(b.avgRating)}
                      </div>
                      <span className="home-card-score">{Number(b.avgRating).toFixed(1)}</span>
                      <span className="home-card-reviews">avg rating</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}
