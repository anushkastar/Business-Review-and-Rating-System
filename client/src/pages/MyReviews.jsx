import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { reviews } from '../api';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&display=swap');

  .reviews-root { font-family: 'DM Sans', sans-serif; color: #2c2417; }

  .reviews-eyebrow {
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: #8a7d6b;
    margin-bottom: 0.5rem;
  }

  .reviews-title {
    font-family: 'Instrument Serif', serif;
    font-size: 1.85rem;
    font-weight: 400;
    color: #2c2417;
    margin: 0 0 0.35rem;
  }

  .reviews-sub { font-size: 0.95rem; color: #8a7d6b; font-weight: 300; margin-bottom: 2rem; }

  .reviews-loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 4rem 0;
    gap: 1rem;
  }

  .reviews-loading-ring {
    width: 38px;
    height: 38px;
    border: 3px solid #e8dfd0;
    border-top-color: #7c6a52;
    border-radius: 50%;
    animation: reviewsSpin 0.8s linear infinite;
  }

  @keyframes reviewsSpin { to { transform: rotate(360deg); } }

  .reviews-loading-text { font-size: 0.9rem; color: #a89070; }

  .reviews-empty {
    background: #fffdf9;
    border: 1px solid #e8dfd0;
    border-radius: 20px;
    padding: 3.5rem 2rem;
    text-align: center;
  }

  .reviews-empty-p { font-size: 0.95rem; color: #6b5d4e; margin-bottom: 1.25rem; }

  .reviews-empty-btn {
    display: inline-block;
    padding: 0.7rem 1.5rem;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.9rem;
    font-weight: 600;
    color: #fffdf9;
    background: #3d3022;
    border: none;
    border-radius: 10px;
    text-decoration: none;
    transition: background 0.2s, transform 0.15s;
  }

  .reviews-empty-btn:hover {
    background: #5a4a38;
    transform: translateY(-1px);
  }

  .reviews-list { list-style: none; padding: 0; margin: 0; }

  .reviews-item {
    background: #fffdf9;
    border: 1px solid #e8dfd0;
    border-radius: 18px;
    padding: 1.5rem 1.75rem;
    margin-bottom: 1rem;
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1rem;
    transition: box-shadow 0.2s, border-color 0.2s;
  }

  .reviews-item:hover {
    box-shadow: 0 8px 28px rgba(44,36,23,0.08);
    border-color: #d8cfc0;
  }

  .reviews-item-left { flex: 1; min-width: 0; }

  .reviews-item-link {
    font-family: 'Instrument Serif', serif;
    font-size: 1.2rem;
    font-weight: 400;
    color: #2c2417;
    text-decoration: none;
    transition: color 0.2s;
  }

  .reviews-item-link:hover { color: #7c6a52; }

  .reviews-item-meta { font-size: 0.85rem; color: #8a7d6b; margin-top: 0.25rem; }

  .reviews-item-tags {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-wrap: wrap;
    margin-top: 0.75rem;
  }

  .reviews-item-stars { color: #c49a3c; font-weight: 700; }

  .reviews-item-status {
    font-size: 0.72rem;
    padding: 0.25rem 0.6rem;
    border-radius: 8px;
    font-weight: 600;
  }

  .reviews-item-status.approved { background: #e8f5e9; color: #2e7d32; }
  .reviews-item-status.pending { background: #f7f4ef; color: #7c6a52; }

  .reviews-item-comment { font-size: 0.9rem; color: #6b5d4e; line-height: 1.55; margin-top: 0.5rem; }

  .reviews-item-photos {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
    margin-top: 0.75rem;
  }

  .reviews-item-photos img {
    width: 56px;
    height: 56px;
    object-fit: cover;
    border-radius: 10px;
    border: 1px solid #e8dfd0;
  }

  .reviews-item-right {
    font-size: 0.85rem;
    color: #8a7d6b;
    flex-shrink: 0;
  }

  .reviews-item-right strong { color: #c49a3c; }
`;

export default function MyReviews() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    reviews.my()
      .then(setList)
      .catch(() => setList([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="reviews-root">
      <style>{styles}</style>
      <div className="reviews-eyebrow">Your activity</div>
      <h1 className="reviews-title">My Reviews</h1>
      <p className="reviews-sub">All the businesses you've reviewed.</p>

      {loading ? (
        <div className="reviews-loading">
          <div className="reviews-loading-ring" />
          <p className="reviews-loading-text">Loading…</p>
        </div>
      ) : list.length === 0 ? (
        <div className="reviews-empty">
          <p className="reviews-empty-p">You haven't reviewed any business yet.</p>
          <Link to="/" className="reviews-empty-btn">Browse businesses</Link>
        </div>
      ) : (
        <ul className="reviews-list">
          {list.map((r) => (
            <li key={r._id} className="reviews-item">
              <div className="reviews-item-left">
                <Link to={'/business/' + r.business?._id} className="reviews-item-link">
                  {r.business?.name}
                </Link>
                <p className="reviews-item-meta">
                  {r.business?.location} · {r.business?.category}
                </p>
                <div className="reviews-item-tags">
                  <span className="reviews-item-stars">★ {r.rating}</span>
                  <span className={`reviews-item-status ${r.approved ? 'approved' : 'pending'}`}>
                    {r.approved ? 'Approved' : 'Pending'}
                  </span>
                </div>
                {r.comment && <p className="reviews-item-comment">{r.comment}</p>}
                {r.photos?.length > 0 && (
                  <div className="reviews-item-photos">
                    {r.photos.map((url, i) => (
                      <img key={i} src={url} alt="" />
                    ))}
                  </div>
                )}
              </div>
              <div className="reviews-item-right">
                Avg rating: <strong>★ {Number(r.business?.avgRating || 0).toFixed(1)}</strong>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
