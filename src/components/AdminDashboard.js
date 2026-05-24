/**
 * AdminDashboard.js
 * Admin Dashboard - Search bookings and assign taxis
 * Mirrors Part 1 admin.html/admin.php functionality using localStorage (demo).
 * Functions:
 *   - searchBookings(): Search by BRN or show upcoming unassigned bookings
 *   - assignTaxi(): Update booking status to 'assigned'
 */

import React, { useState } from 'react';

export default function AdminDashboard() {
  const [bsearch,  setBsearch]  = useState('');
  const [bookings, setBookings] = useState(null);
  const [message,  setMessage]  = useState({ text: '', type: '' });

  // Search bookings — mirrors admin.php searchBookings()
  function searchBookings() {
    setMessage({ text: '', type: '' });
    setBookings(null);

    // Validate BRN format if non-empty
    if (bsearch.trim() !== '') {
      if (!/^BRN\d{5}$/.test(bsearch.trim())) {
        setMessage({ text: 'Invalid format. Booking reference number must be in the format BRN00001.', type: 'error' });
        return;
      }
    }

    const all = JSON.parse(localStorage.getItem('bookings') || '[]');

    if (bsearch.trim() !== '') {
      // Search by BRN
      const found = all.filter(b => b.brn === bsearch.trim());
      setBookings(found);
    } else {
      // Show unassigned bookings with pickup within 2 hours from now
      const now = new Date();
      const twoHoursLater = new Date(now.getTime() + 2 * 60 * 60 * 1000);

      const upcoming = all.filter(b => {
        if (b.status !== 'unassigned') return false;
        // Parse dd/mm/yyyy HH:MM
        const [d, m, y] = (b.date || b.pickup_date || '').split('/');
        const t = b.time || b.pickup_time || '00:00';
        if (!d || !m || !y) return false;
        const pickup = new Date(`${y}-${m}-${d}T${t}`);
        return pickup >= now && pickup <= twoHoursLater;
      });
      setBookings(upcoming);
    }
  }

  // Assign taxi — mirrors admin.php assignTaxi()
  function assignTaxi(brn) {
    const all = JSON.parse(localStorage.getItem('bookings') || '[]');
    const updated = all.map(b => b.brn === brn ? { ...b, status: 'assigned' } : b);
    localStorage.setItem('bookings', JSON.stringify(updated));

    // Update displayed bookings
    setBookings(prev => prev.map(b => b.brn === brn ? { ...b, status: 'assigned' } : b));
    setMessage({ text: `Congratulations! Booking request ${brn} has been assigned!`, type: 'success' });
  }

  return (
    <div>
      <div className="card">
        <h2>🛠️ Admin Dashboard</h2>
        <p style={{ marginBottom: 16, color: '#555' }}>
          Search for a booking by reference number, or leave blank to see upcoming unassigned bookings (within 2 hours).
        </p>

        {/* Search row — matches admin.html: name="bsearch", name="sbutton" */}
        <div className="brn-row">
          <input
            type="text"
            name="bsearch"
            id="bsearch"
            value={bsearch}
            onChange={e => setBsearch(e.target.value)}
            placeholder="e.g. BRN00001 (leave empty for upcoming)"
          />
          <button name="sbutton" id="sbutton" onClick={searchBookings}>
            Search Bookings
          </button>
        </div>

        {message.text && (
          <p className={message.type === 'error' ? 'error' : 'success'} id="message">
            {message.type === 'error' ? '⚠️' : '✅'} {message.text}
          </p>
        )}
      </div>

      {/* Results table — matches admin.html: div class="content" */}
      {bookings !== null && (
        <div className="card content" id="results" style={{ padding: 0, overflowX: 'auto' }}>
          {bookings.length === 0 ? (
            <p style={{ padding: 24, textAlign: 'center', color: '#999' }}>No bookings found.</p>
          ) : (
            <table className="history-table">
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
                    <td><strong>{b.brn}</strong></td>
                    <td>{b.cname}</td>
                    <td>{b.phone}</td>
                    <td>{b.sbname || '—'}</td>
                    <td>{b.dsbname || '—'}</td>
                    <td>{(b.date || b.pickup_date)} {(b.time || b.pickup_time)}</td>
                    <td id={`status-${b.brn}`}>
                      <span className={`status-badge status-${b.status}`}>{b.status}</span>
                    </td>
                    <td>
                      <button
                        name="Assign"
                        id={`btn-${b.brn}`}
                        onClick={() => assignTaxi(b.brn)}
                        disabled={b.status === 'assigned'}
                        style={{
                          background: b.status === 'assigned' ? '#ccc' : '#1a237e',
                          color: 'white',
                          padding: '6px 14px',
                          borderRadius: '6px',
                          fontSize: '0.85rem',
                          cursor: b.status === 'assigned' ? 'not-allowed' : 'pointer'
                        }}
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
