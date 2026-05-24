/**
 * BookingTracker.js
 * Feature 2: Live Booking Status Tracker
 * Customers can look up their booking reference number to see the current status.
 * Reads from localStorage (demo data).
 */

import React, { useState } from 'react';

export default function BookingTracker() {
  const [brn, setBrn]         = useState('');
  const [booking, setBooking] = useState(null);
  const [error, setError]     = useState('');

  function handleSearch() {
    setError('');
    setBooking(null);

    if (!brn.trim()) {
      setError('Please enter a booking reference number.');
      return;
    }
    if (!/^BRN\d{5}$/.test(brn.trim())) {
      setError('Invalid format. Must be like BRN00001.');
      return;
    }

    // Look up in localStorage
    const all = JSON.parse(localStorage.getItem('bookings') || '[]');
    const found = all.find(b => b.brn === brn.trim());

    if (!found) {
      // Show a demo booking if not found (so markers can demo without booking first)
      setError('No booking found with that reference number. Try booking first!');
      return;
    }

    setBooking(found);
  }

  function getStatusBadge(status) {
    const cls = `status-badge status-${status}`;
    return <span className={cls}>{status}</span>;
  }

  // Status progress steps
  const steps = ['unassigned', 'assigned', 'completed'];

  return (
    <div>
      <div className="card">
        <h2>🔍 Track Your Booking</h2>
        <p style={{ marginBottom: 16, color: '#555' }}>
          Enter your booking reference number to see the current status.
        </p>
        <div className="brn-row">
          <input
            value={brn}
            onChange={e => setBrn(e.target.value)}
            placeholder="e.g. BRN00001"
          />
          <button onClick={handleSearch}>Search</button>
        </div>
        {error && <p className="error">⚠️ {error}</p>}
      </div>

      {booking && (
        <div className="card">
          <h2>Booking Details</h2>

          {/* Status progress bar */}
          <div style={{ display: 'flex', gap: 0, marginBottom: 24 }}>
            {steps.map((step, i) => {
              const current = steps.indexOf(booking.status);
              const done    = i <= current;
              return (
                <div key={step} style={{ flex: 1, textAlign: 'center' }}>
                  <div style={{
                    height: 8,
                    background: done ? '#1a237e' : '#e0e0e0',
                    borderRadius: i === 0 ? '8px 0 0 8px' : i === steps.length - 1 ? '0 8px 8px 0' : 0
                  }} />
                  <div style={{
                    marginTop: 6,
                    fontSize: '0.8rem',
                    fontWeight: done ? 'bold' : 'normal',
                    color: done ? '#1a237e' : '#999',
                    textTransform: 'capitalize'
                  }}>{step}</div>
                </div>
              );
            })}
          </div>

          <div className="tracker-detail">
            <table>
              <tbody>
                <tr><td>Booking Reference</td><td><strong>{booking.brn}</strong></td></tr>
                <tr><td>Customer Name</td><td>{booking.cname}</td></tr>
                <tr><td>Phone</td><td>{booking.phone}</td></tr>
                <tr><td>Pickup Address</td><td>
                  {booking.unumber ? `${booking.unumber}/` : ''}{booking.snumber} {booking.stname}
                  {booking.sbname ? `, ${booking.sbname}` : ''}
                </td></tr>
                <tr><td>Destination</td><td>{booking.dsbname || '—'}</td></tr>
                <tr><td>Pickup Date</td><td>{booking.pickup_date || booking.date}</td></tr>
                <tr><td>Pickup Time</td><td>{booking.pickup_time || booking.time}</td></tr>
                <tr><td>Status</td><td>{getStatusBadge(booking.status)}</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
