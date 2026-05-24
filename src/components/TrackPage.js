/**
 * TrackPage.js
 * Page 2: Track Booking Status
 * Look up a BRN to see booking details and status progress.
 */

import React, { useState } from 'react';

const STEPS = ['unassigned', 'assigned', 'completed'];

export default function TrackPage() {
  const [brn,     setBrn]     = useState('');
  const [booking, setBooking] = useState(null);
  const [error,   setError]   = useState('');

  function search() {
    setError(''); setBooking(null);
    if (!brn.trim())              { setError('Please enter a booking reference number.'); return; }
    if (!/^BRN\d{5}$/.test(brn)) { setError('Invalid format — must be like BRN00001.');  return; }
    const all   = JSON.parse(localStorage.getItem('bookings') || '[]');
    const found = all.find(b => b.brn === brn.trim());
    if (!found) { setError('No booking found. Make a booking first!'); return; }
    setBooking(found);
  }

  const currentStep = booking ? STEPS.indexOf(booking.status) : -1;

  return (
    <div>
      <h1 className="page-title">Track Your Booking</h1>
      <p className="page-subtitle">Enter your booking reference number to see the current status.</p>

      <div className="card">
        <div className="card-title">Booking Reference</div>
        <div className="search-row">
          <input
            value={brn}
            onChange={e => setBrn(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && search()}
            placeholder="e.g. BRN00001"
          />
          <button className="btn-secondary" onClick={search} style={{ flexShrink: 0, marginBottom: 0 }}>
            Search
          </button>
        </div>
        {error && <p className="msg-error">⚠ {error}</p>}
      </div>

      {booking && (
        <div className="card">
          <div className="card-title">Booking Details</div>

          {/* Progress bar */}
          <div className="progress-bar">
            {STEPS.map((step, i) => (
              <div key={step} className="progress-step">
                <div className={`progress-line ${i <= currentStep ? 'done' : 'pending'}`} />
                <div className={`progress-label ${i <= currentStep ? 'done' : 'pending'}`}>{step}</div>
              </div>
            ))}
          </div>

          <table className="detail-table">
            <tbody>
              <tr><td>Reference</td><td><strong style={{ color: 'var(--yellow)' }}>{booking.brn}</strong></td></tr>
              <tr><td>Customer</td><td>{booking.cname}</td></tr>
              <tr><td>Phone</td><td>{booking.phone}</td></tr>
              <tr><td>Pickup Address</td><td>
                {booking.unumber ? `${booking.unumber}/` : ''}{booking.snumber} {booking.stname}
                {booking.sbname ? `, ${booking.sbname}` : ''}
              </td></tr>
              <tr><td>Destination</td><td>{booking.dsbname || '—'}</td></tr>
              <tr><td>Pickup Date</td><td>{booking.date}</td></tr>
              <tr><td>Pickup Time</td><td>{booking.time}</td></tr>
              <tr><td>Status</td><td>
                <span className={`badge badge-${booking.status}`}>{booking.status}</span>
              </td></tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
