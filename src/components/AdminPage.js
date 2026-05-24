/**
 * AdminPage.js
 * Page 4: Admin Dashboard
 * Search bookings by BRN or show upcoming unassigned bookings, then assign taxis.
 * Mirrors Part 1 admin.html/admin.php using localStorage.
 */

import React, { useState } from 'react';

export default function AdminPage() {
  const [bsearch,  setBsearch]  = useState('');
  const [bookings, setBookings] = useState(null);
  const [message,  setMessage]  = useState({ text: '', type: '' });

  // Mirrors admin.php searchBookings()
  function searchBookings() {
    setMessage({ text: '', type: '' }); setBookings(null);

    if (bsearch.trim() !== '' && !/^BRN\d{5}$/.test(bsearch.trim())) {
      setMessage({ text: 'Invalid format. Must be like BRN00001.', type: 'error' });
      return;
    }

    const all = JSON.parse(localStorage.getItem('bookings') || '[]');

    if (bsearch.trim() !== '') {
      setBookings(all.filter(b => b.brn === bsearch.trim()));
    } else {
      const now = new Date();
      const in2h = new Date(now.getTime() + 2 * 60 * 60 * 1000);
      setBookings(all.filter(b => {
        if (b.status !== 'unassigned') return false;
        const [d, m, y] = (b.date || '').split('/');
        if (!d) return false;
        const pickup = new Date(`${y}-${m}-${d}T${b.time}`);
        return pickup >= now && pickup <= in2h;
      }));
    }
  }

  // Mirrors admin.php assignTaxi()
  function assignTaxi(brn) {
    const all = JSON.parse(localStorage.getItem('bookings') || '[]');
    localStorage.setItem('bookings', JSON.stringify(all.map(b => b.brn === brn ? { ...b, status: 'assigned' } : b)));
    setBookings(prev => prev.map(b => b.brn === brn ? { ...b, status: 'assigned' } : b));
    setMessage({ text: `Congratulations! Booking request ${brn} has been assigned!`, type: 'success' });
  }

  return (
    <div>
      <h1 className="page-title">Admin Dashboard</h1>
      <p className="page-subtitle">Search bookings by reference number, or leave blank to see upcoming unassigned bookings.</p>

      <div className="card">
        <div className="card-title">Search Bookings</div>
        <div className="search-row">
          <input
            type="text"
            name="bsearch"
            id="bsearch"
            value={bsearch}
            onChange={e => setBsearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && searchBookings()}
            placeholder="BRN00001 — leave empty for upcoming bookings"
          />
          <button
            name="sbutton"
            id="sbutton"
            className="btn-secondary"
            onClick={searchBookings}
            style={{ flexShrink: 0, marginBottom: 0 }}
          >
            Search Bookings
          </button>
        </div>
        {message.text && (
          <p className={message.type === 'error' ? 'msg-error' : 'msg-success'} id="message">
            {message.type === 'error' ? '⚠ ' : '✅ '}{message.text}
          </p>
        )}
      </div>

      {/* Results — div class="content" matches assignment spec */}
      {bookings !== null && (
        <div className="card content" id="results" style={{ padding: 0, overflowX: 'auto' }}>
          {bookings.length === 0 ? (
            <p style={{ padding: 24, textAlign: 'center', color: 'var(--muted)' }}>No bookings found.</p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Booking Reference Number</th>
                  <th>Customer Name</th>
                  <th>Phone</th>
                  <th>Pickup Suburb</th>
                  <th>Destination Suburb</th>
                  <th>Pickup Date and Time</th>
                  <th>Status</th>
                  <th>Assign</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map(b => (
                  <tr key={b.brn} id={`row-${b.brn}`}>
                    <td><strong style={{ color: 'var(--yellow)' }}>{b.brn}</strong></td>
                    <td>{b.cname}</td>
                    <td>{b.phone}</td>
                    <td>{b.sbname || '—'}</td>
                    <td>{b.dsbname || '—'}</td>
                    <td>{b.date} {b.time}</td>
                    <td id={`status-${b.brn}`}>
                      <span className={`badge badge-${b.status}`}>{b.status}</span>
                    </td>
                    <td>
                      <button
                        name="Assign"
                        id={`btn-${b.brn}`}
                        className="btn-primary btn-sm"
                        onClick={() => assignTaxi(b.brn)}
                        disabled={b.status === 'assigned'}
                        style={{ opacity: b.status === 'assigned' ? 0.4 : 1, cursor: b.status === 'assigned' ? 'not-allowed' : 'pointer' }}
                      >
                        Assign
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
