import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { businesses as bizApi, reviews as revApi } from '../api';
import { useAuth } from '../context/AuthContext';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&display=swap');

  .detail-root { font-family: 'DM Sans', sans-serif; color: #2c2417; }

  .detail-loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 5rem 0;
    gap: 1rem;
  }

  .detail-loading-ring {
    width: 40px;
    height: 40px;
    border: 3px solid #e8dfd0;
    border-top-color: #7c6a52;
    border-radius: 50%;
    animation: detailSpin 0.8s linear infinite;
  }

  .detail-loading-text { font-size: 0.9rem; color: #a89070; font-weight: 400; }
  @keyframes detailSpin { to { transform: rotate(360deg); } }

  .detail-card {
    background: #fffdf9;
    border: 1px solid #e8dfd0;
    border-radius: 20px;
    overflow: hidden;
    margin-bottom: 2rem;
    box-shadow: 0 4px 24px rgba(44,36,23,0.07);
  }

  .detail-media {
    aspect-ratio: 16/10;
    max-height: 320px;
    overflow: hidden;
    background: linear-gradient(135deg, #ede5d8 0%, #d8cfc0 100%);
  }

  .detail-media img { width: 100%; height: 100%; object-fit: cover; }

  .detail-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 4rem;
    opacity: 0.4;
  }

  .detail-body { padding: 1.75rem 2rem 2rem; }

  .detail-name {
    font-family: 'Instrument Serif', serif;
    font-size: 1.85rem;
    font-weight: 400;
    color: #2c2417;
    margin: 0 0 0.5rem;
  }

  .detail-meta {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex-wrap: wrap;
    margin-bottom: 0.75rem;
  }

  .detail-badge {
    padding: 0.3rem 0.75rem;
    background: #f7f4ef;
    border: 1px solid #e2d8cb;
    border-radius: 999px;
    font-size: 0.8rem;
    font-weight: 600;
    color: #5a4a38;
  }

  .detail-location { font-size: 0.9rem; color: #8a7d6b; }

  .detail-desc { font-size: 0.95rem; color: #6b5d4e; line-height: 1.6; margin-top: 1rem; }

  .detail-rating-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-top: 1.25rem;
    padding-top: 1.25rem;
    border-top: 1px solid #f0e8dc;
  }

  .detail-stars { color: #c49a3c; font-size: 1.1rem; }
  .detail-score { font-size: 1.25rem; font-weight: 700; color: #2c2417; }
  .detail-review-count { font-size: 0.85rem; color: #a89070; }

  .detail-section-title {
    font-family: 'Instrument Serif', serif;
    font-size: 1.35rem;
    font-weight: 400;
    color: #2c2417;
    margin: 0 0 1.25rem;
  }

  .detail-form-card {
    background: #fffdf9;
    border: 1px solid #e8dfd0;
    border-radius: 20px;
    padding: 2rem;
    margin-bottom: 2rem;
    box-shadow: 0 4px 24px rgba(44,36,23,0.07);
  }

  .detail-field { margin-bottom: 1.25rem; }

  .detail-label {
    display: block;
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #6b5d4e;
    margin-bottom: 0.5rem;
  }

  .detail-input,
  .detail-select,
  .detail-textarea {
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

  .detail-textarea { min-height: 88px; resize: vertical; }

  .detail-input:focus,
  .detail-select:focus,
  .detail-textarea:focus {
    border-color: #a89070;
    box-shadow: 0 0 0 3px rgba(168,144,112,0.12);
  }

  .detail-error {
    background: rgba(185,28,28,0.08);
    border: 1px solid rgba(185,28,28,0.25);
    border-left: 3px solid #b91c1c;
    border-radius: 10px;
    padding: 0.75rem 1rem;
    font-size: 0.85rem;
    color: #991b1b;
    margin-bottom: 1.25rem;
  }

  .detail-btn {
    padding: 0.75rem 1.5rem;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.9rem;
    font-weight: 600;
    color: #fffdf9;
    background: #3d3022;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    transition: background 0.2s, transform 0.15s;
  }

  .detail-btn:hover:not(:disabled) {
    background: #5a4a38;
    transform: translateY(-1px);
  }

  .detail-btn:disabled { opacity: 0.6; cursor: not-allowed; }

  .detail-reviews-list { list-style: none; padding: 0; margin: 0; }

  .detail-review-item {
    background: #fffdf9;
    border: 1px solid #e8dfd0;
    border-radius: 16px;
    padding: 1.25rem 1.5rem;
    margin-bottom: 1rem;
    box-shadow: 0 2px 8px rgba(44,36,23,0.04);
  }

  .detail-review-head {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex-wrap: wrap;
    margin-bottom: 0.5rem;
  }

  .detail-review-user { font-weight: 600; color: #2c2417; }
  .detail-review-stars { color: #c49a3c; font-size: 0.9rem; }

  .detail-review-pending {
    font-size: 0.72rem;
    padding: 0.2rem 0.5rem;
    background: #f7f4ef;
    border-radius: 6px;
    color: #7c6a52;
    font-weight: 600;
  }

  .detail-review-comment { font-size: 0.9rem; color: #6b5d4e; line-height: 1.55; }

  .detail-review-photos {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
    margin-top: 0.75rem;
  }

  .detail-review-photos img {
    width: 72px;
    height: 72px;
    object-fit: cover;
    border-radius: 10px;
    border: 1px solid #e8dfd0;
  }

  .detail-empty {
    background: #fffdf9;
    border: 1px solid #e8dfd0;
    border-radius: 20px;
    padding: 3rem 2rem;
    text-align: center;
    font-size: 0.95rem;
    color: #8a7d6b;
  }
`;

export default function BusinessDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [business, setBusiness] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [photos, setPhotos] = useState([]);
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    Promise.all([
      bizApi.get(id).catch(() => null),
      revApi.byBusiness(id).catch(() => [])
    ]).then(([b, r]) => {
      setBusiness(b);
      setReviews(Array.isArray(r) ? r : []);
    }).finally(() => setLoading(false));
  }, [id]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user || user.role !== 'user') return;
    setSubmitError('');
    setSubmitting(true);
    const formData = new FormData();
    formData.append('businessId', id);
    formData.append('rating', rating);
    formData.append('comment', comment);
    photos.forEach((file) => formData.append('photos', file));
    try {
      await revApi.submit(formData);
      setComment('');
      setRating(5);
      setPhotos([]);
      const r = await revApi.byBusiness(id);
      setReviews(Array.isArray(r) ? r : []);
    } catch (err) {
      setSubmitError(err.message || 'Failed to submit');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !business) {
    return (
      <div className="detail-root">
        <style>{styles}</style>
        <div className="detail-loading">
          <div className="detail-loading-ring" />
          <p className="detail-loading-text">{loading ? 'Loading…' : 'Business not found.'}</p>
        </div>
      </div>
    );
  }

  const renderStars = (r) => [1,2,3,4,5].map((i) => (
    <span key={i} style={{ color: i <= r ? '#c49a3c' : '#e2d8cb' }}>★</span>
  ));

  return (
    <div className="detail-root">
      <style>{styles}</style>

      <div className="detail-card">
        <div className="detail-media">
          {business.photo ? (
            <img src={business.photo} alt={business.name} />
          ) : (
            <div className="detail-placeholder">📷</div>
          )}
        </div>
        <div className="detail-body">
          <h1 className="detail-name">{business.name}</h1>
          <div className="detail-meta">
            <span className="detail-badge">{business.category}</span>
            <span className="detail-location">{business.location}</span>
          </div>
          {business.description && <p className="detail-desc">{business.description}</p>}
          <div className="detail-rating-row">
            <span className="detail-stars">{renderStars(Number(business.avgRating))}</span>
            <span className="detail-score">{Number(business.avgRating).toFixed(1)}</span>
            <span className="detail-review-count">
              avg rating
              {business.reviewCount != null && ` · ${business.reviewCount} reviews`}
            </span>
          </div>
        </div>
      </div>

      {user?.role === 'user' && (
        <form onSubmit={handleSubmitReview} className="detail-form-card">
          <h2 className="detail-section-title">Write a review</h2>
          {submitError && <div className="detail-error">⚠ {submitError}</div>}
          <div className="detail-field">
            <label className="detail-label">Rating (1–5)</label>
            <select value={rating} onChange={(e) => setRating(Number(e.target.value))} className="detail-select" style={{ maxWidth: '140px' }}>
              {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n} ★</option>)}
            </select>
          </div>
          <div className="detail-field">
            <label className="detail-label">Comment</label>
            <textarea value={comment} onChange={(e) => setComment(e.target.value)} rows={3} className="detail-textarea" placeholder="Share your experience…" />
          </div>
          <div className="detail-field">
            <label className="detail-label">Photos (optional)</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => setPhotos(Array.from(e.target.files || []))}
              className="detail-input"
            />
          </div>
          <button type="submit" disabled={submitting} className="detail-btn">
            {submitting ? 'Submitting…' : 'Submit review'}
          </button>
        </form>
      )}

      <h2 className="detail-section-title">Reviews</h2>
      {reviews.length === 0 ? (
        <div className="detail-empty">No reviews yet. Be the first to review!</div>
      ) : (
        <ul className="detail-reviews-list">
          {reviews.map((r) => (
            <li key={r._id} className="detail-review-item">
              <div className="detail-review-head">
                <span className="detail-review-user">{r.user?.name}</span>
                <span className="detail-review-stars">★ {r.rating}</span>
                {!r.approved && <span className="detail-review-pending">Pending</span>}
              </div>
              {r.comment && <p className="detail-review-comment">{r.comment}</p>}
              {r.photos?.length > 0 && (
                <div className="detail-review-photos">
                  {r.photos.map((url, i) => (
                    <img key={i} src={url} alt="" />
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
