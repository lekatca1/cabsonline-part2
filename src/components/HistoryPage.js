/**
 * HistoryPage.js
 * Page 5: Booking History
 */

import React, { useState, useEffect } from 'react';

const FILTERS = ['all', 'unassigned', 'assigned', 'completed'];

export default function HistoryPage() {
  const [bookings, setBookings] = useState([]);
  const [filter,   setFilter]   = useState('all');

  useEffect(() => {
    const all = JSON.parse(localStorage.getItem('bookings') || '[]');
    setBookings([...all].reverse());
  }, []);

  const shown = filter === 'all' ? bookings : bookings.filter(b => b.status === filter);

  return (
    <div>
      <h1 className="page-title">Booking History</h1>
      <p className="page-subtitle">{bookings.length} booking{bookings.length !== 1 ? 's' : ''} this session.</p>

      <div className="filter-pills">
        {FILTERS.map(f => (
          <button key={f} className={`filter-pill ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
        {shown.length === 0 ? (
          <p style={{ padding: 24, textAlign: 'center', color: 'var(--muted)' }}>
            No bookings found. Make a booking first!
          </p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>BRN</th>
                <th>Customer</th>
                <th>Phone</th>
                <th>Pickup Suburb</th>
                <th>Destination</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {shown.map(b => (
                <tr key={b.brn}>
                  <td><strong style={{ color: 'var(--yellow)' }}>{b.brn}</strong></td>
                  <td>{b.cname}</td>
                  <td>{b.phone}</td>
                  <td>{b.sbname || '—'}</td>
                  <td>{b.dsbname || '—'}</td>
                  <td>{b.date}</td>
                  <td>{b.time}</td>
                  <td><span className={`badge badge-${b.status}`}>{b.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
