import React, { useState, useEffect } from 'react';
import { admin } from '../api';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&display=swap');

  .admin-root { font-family: 'DM Sans', sans-serif; color: #2c2417; }

  .admin-eyebrow {
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: #8a7d6b;
    margin-bottom: 0.5rem;
  }

  .admin-title {
    font-family: 'Instrument Serif', serif;
    font-size: 1.85rem;
    font-weight: 400;
    color: #2c2417;
    margin: 0 0 0.35rem;
  }

  .admin-sub { font-size: 0.95rem; color: #8a7d6b; font-weight: 300; margin-bottom: 2rem; }

  .admin-loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 5rem 0;
    gap: 1rem;
  }

  .admin-loading-ring {
    width: 42px;
    height: 42px;
    border: 3px solid #e8dfd0;
    border-top-color: #7c6a52;
    border-radius: 50%;
    animation: adminSpin 0.8s linear infinite;
  }

  @keyframes adminSpin { to { transform: rotate(360deg); } }

  .admin-stats {
    display: grid;
    gap: 1rem;
    grid-template-columns: repeat(2, 1fr);
    margin-bottom: 2rem;
  }

  @media (min-width: 640px) { .admin-stats { grid-template-columns: repeat(4, 1fr); } }

  .admin-stat {
    background: #fffdf9;
    border: 1px solid #e8dfd0;
    border-radius: 16px;
    padding: 1.25rem 1.5rem;
    border-left: 4px solid #a89070;
    box-shadow: 0 2px 8px rgba(44,36,23,0.04);
  }

  .admin-stat.biz { border-left-color: #7c6a52; }
  .admin-stat.rev { border-left-color: #c49a3c; }
  .admin-stat.ok { border-left-color: #5a7d5a; }
  .admin-stat.usr { border-left-color: #6b5d8a; }

  .admin-stat-label {
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #8a7d6b;
  }

  .admin-stat-value { font-size: 1.75rem; font-weight: 700; color: #2c2417; margin-top: 0.25rem; }

  .admin-stat-extra { font-size: 0.75rem; color: #a89070; margin-top: 0.35rem; font-weight: 500; }

  .admin-tabs {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
  }

  .admin-tab {
    padding: 0.6rem 1.25rem;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.9rem;
    font-weight: 600;
    color: #6b5d4e;
    background: #f7f4ef;
    border: 1.5px solid #e2d8cb;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .admin-tab:hover {
    background: #ede5d8;
    border-color: #c4b49a;
    color: #2c2417;
  }

  .admin-tab.active {
    background: #3d3022;
    border-color: #3d3022;
    color: #fffdf9;
  }

  .admin-table-wrap {
    background: #fffdf9;
    border: 1px solid #e8dfd0;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 4px 24px rgba(44,36,23,0.07);
  }

  .admin-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.875rem;
  }

  .admin-table th {
    text-align: left;
    padding: 1rem 1.25rem;
    background: #f7f4ef;
    border-bottom: 2px solid #e8dfd0;
    font-weight: 600;
    color: #5a4a38;
  }

  .admin-table td {
    padding: 1rem 1.25rem;
    border-bottom: 1px solid #f0e8dc;
    color: #2c2417;
  }

  .admin-table tbody tr:hover { background: #faf8f5; }

  .admin-table .category-badge {
    display: inline-block;
    padding: 0.25rem 0.6rem;
    background: #f7f4ef;
    border-radius: 8px;
    font-size: 0.8rem;
    font-weight: 600;
    color: #5a4a38;
  }

  .admin-table .status-ok {
    padding: 0.25rem 0.6rem;
    border-radius: 8px;
    font-size: 0.8rem;
    font-weight: 600;
    background: #e8f5e9;
    color: #2e7d32;
  }

  .admin-table .status-pending {
    padding: 0.25rem 0.6rem;
    border-radius: 8px;
    font-size: 0.8rem;
    font-weight: 600;
    background: #f7f4ef;
    color: #7c6a52;
  }

  .admin-table .rating { color: #c49a3c; font-weight: 700; }

  .admin-table .btn-action {
    background: none;
    border: none;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.85rem;
    font-weight: 600;
    cursor: pointer;
    padding: 0.2rem 0;
    margin-right: 1rem;
    transition: color 0.2s;
  }

  .admin-table .btn-approve { color: #2e7d32; }
  .admin-table .btn-approve:hover { color: #1b5e20; }

  .admin-table .btn-reject { color: #b91c1c; }
  .admin-table .btn-reject:hover { color: #991b1b; }

  .admin-empty {
    padding: 2.5rem;
    text-align: center;
    font-size: 0.95rem;
    color: #8a7d6b;
  }
`;

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [businesses, setBusinesses] = useState([]);
  const [pendingReviews, setPendingReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('businesses');

  const load = () => {
    Promise.all([
      admin.dashboard(),
      admin.businesses(),
      admin.pendingReviews()
    ]).then(([s, b, r]) => {
      setStats(s);
      setBusinesses(b);
      setPendingReviews(r);
    }).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => {
    setLoading(true);
    load();
  }, []);

  const handleApproveBusiness = async (id) => {
    try {
      await admin.approveBusiness(id);
      load();
    } catch (e) {
      alert(e.message);
    }
  };

  const handleRejectBusiness = async (id) => {
    try {
      await admin.rejectBusiness(id);
      load();
    } catch (e) {
      alert(e.message);
    }
  };

  const handleApproveReview = async (id) => {
    try {
      await admin.approveReview(id);
      load();
    } catch (e) {
      alert(e.message);
    }
  };

  const handleRejectReview = async (id) => {
    try {
      await admin.rejectReview(id);
      load();
    } catch (e) {
      alert(e.message);
    }
  };

  if (loading && !stats) {
    return (
      <div className="admin-root">
        <style>{styles}</style>
        <div className="admin-loading">
          <div className="admin-loading-ring" />
          <p className="admin-sub">Loading dashboard…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-root">
      <style>{styles}</style>
      <div className="admin-eyebrow">Administration</div>
      <h1 className="admin-title">Admin Dashboard</h1>
      <p className="admin-sub">Manage businesses and reviews.</p>

      {stats && (
        <div className="admin-stats">
          <div className="admin-stat biz">
            <div className="admin-stat-label">Businesses</div>
            <div className="admin-stat-value">{stats.businesses}</div>
            <div className="admin-stat-extra">{stats.pendingBusinesses} pending</div>
          </div>
          <div className="admin-stat rev">
            <div className="admin-stat-label">Reviews</div>
            <div className="admin-stat-value">{stats.reviews}</div>
            <div className="admin-stat-extra">{stats.pendingReviews} pending</div>
          </div>
          <div className="admin-stat ok">
            <div className="admin-stat-label">Approved</div>
            <div className="admin-stat-value">{stats.approvedBusinesses}</div>
          </div>
          <div className="admin-stat usr">
            <div className="admin-stat-label">Users</div>
            <div className="admin-stat-value">{stats.users}</div>
          </div>
        </div>
      )}

      <div className="admin-tabs">
        <button
          type="button"
          onClick={() => setTab('businesses')}
          className={`admin-tab${tab === 'businesses' ? ' active' : ''}`}
        >
          Approve businesses
        </button>
        <button
          type="button"
          onClick={() => setTab('reviews')}
          className={`admin-tab${tab === 'reviews' ? ' active' : ''}`}
        >
          Approve reviews
        </button>
      </div>

      {tab === 'businesses' && (
        <div className="admin-table-wrap">
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Location</th>
                  <th>Category</th>
                  <th>Owner</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {businesses.map((b) => (
                  <tr key={b._id}>
                    <td style={{ fontWeight: 600 }}>{b.name}</td>
                    <td>{b.location}</td>
                    <td><span className="category-badge">{b.category}</span></td>
                    <td>{b.owner?.name || '—'}</td>
                    <td>
                      {b.approved ? (
                        <span className="status-ok">Approved</span>
                      ) : (
                        <span className="status-pending">Pending</span>
                      )}
                    </td>
                    <td>
                      {!b.approved && (
                        <>
                          <button type="button" onClick={() => handleApproveBusiness(b._id)} className="btn-action btn-approve">Approve</button>
                          <button type="button" onClick={() => handleRejectBusiness(b._id)} className="btn-action btn-reject">Reject</button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {businesses.length === 0 && <p className="admin-empty">No businesses.</p>}
        </div>
      )}

      {tab === 'reviews' && (
        <div className="admin-table-wrap">
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Business</th>
                  <th>Rating</th>
                  <th>Comment</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingReviews.map((r) => (
                  <tr key={r._id}>
                    <td style={{ fontWeight: 600 }}>{r.user?.name}</td>
                    <td>{r.business?.name} ({r.business?.location})</td>
                    <td><span className="rating">★ {r.rating}</span></td>
                    <td style={{ maxWidth: '240px' }}>{r.comment || '—'}</td>
                    <td>
                      <button type="button" onClick={() => handleApproveReview(r._id)} className="btn-action btn-approve">Approve</button>
                      <button type="button" onClick={() => handleRejectReview(r._id)} className="btn-action btn-reject">Reject</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {pendingReviews.length === 0 && <p className="admin-empty">No pending reviews.</p>}
        </div>
      )}
    </div>
  );
}
