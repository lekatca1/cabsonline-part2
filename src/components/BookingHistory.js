/**
 * BookingHistory.js
 * Feature 5 (bonus): Booking History / Past Trips
 * Shows all bookings stored in localStorage for this browser session.
 * Useful for customers to review their past bookings.
 */

import React, { useState, useEffect } from 'react';

export default function BookingHistory() {
  const [bookings, setBookings] = useState([]);
  const [filter,   setFilter]   = useState('all');

  useEffect(() => {
    const all = JSON.parse(localStorage.getItem('bookings') || '[]');
    setBookings(all.reverse()); // newest first
  }, []);

  function getStatusBadge(status) {
    return <span className={`status-badge status-${status}`}>{status}</span>;
  }

  const shown = filter === 'all' ? bookings : bookings.filter(b => b.status === filter);

  return (
    <div>
      <div className="card">
        <h2>📋 Booking History</h2>
        <p style={{ marginBottom: 16, color: '#555' }}>
          All bookings made in this browser session. ({bookings.length} total)
        </p>

        <div style={{ display: 'flex', gap: 10, marginBottom: 8, flexWrap: 'wrap' }}>
          {['all', 'unassigned', 'assigned', 'completed'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                background: filter === f ? '#1a237e' : '#e0e0e0',
                color:      filter === f ? 'white'    : '#333',
                padding: '8px 16px', borderRadius: '20px', fontSize: '0.9rem'
              }}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
        {shown.length === 0 ? (
          <p style={{ padding: 24, textAlign: 'center', color: '#999' }}>
            No bookings found. Make a booking first!
          </p>
        ) : (
          <table className="history-table">
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
                  <td><strong>{b.brn}</strong></td>
                  <td>{b.cname}</td>
                  <td>{b.phone}</td>
                  <td>{b.sbname || '—'}</td>
                  <td>{b.dsbname || '—'}</td>
                  <td>{b.date}</td>
                  <td>{b.time}</td>
                  <td>{getStatusBadge(b.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
