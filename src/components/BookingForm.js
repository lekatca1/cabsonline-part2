/**
 * BookingForm.js
 * Feature 1: Booking Form (extends Part 1 booking.html with React)
 * Allows passengers to submit a taxi booking request.
 * Stores bookings in localStorage for demo purposes.
 */

import React, { useState, useEffect } from 'react';

// Helper: get today's date as dd/mm/yyyy
function getTodayDate() {
  const now = new Date();
  const d = String(now.getDate()).padStart(2, '0');
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const y = now.getFullYear();
  return `${d}/${m}/${y}`;
}

// Helper: get current time as HH:MM
function getCurrentTime() {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
}

// Helper: generate next BRN from localStorage
function generateBRN() {
  const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
  const next = bookings.length + 1;
  return 'BRN' + String(next).padStart(5, '0');
}

export default function BookingForm() {
  const [form, setForm] = useState({
    cname: '', phone: '', unumber: '', snumber: '',
    stname: '', sbname: '', dsbname: '',
    date: getTodayDate(), time: getCurrentTime()
  });
  const [error, setError]     = useState('');
  const [confirm, setConfirm] = useState(null);

  // Update date/time every minute
  useEffect(() => {
    setForm(f => ({ ...f, date: getTodayDate(), time: getCurrentTime() }));
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function validate() {
    if (!form.cname)   return 'Customer name is required.';
    if (!form.phone)   return 'Phone number is required.';
    if (!/^\d{10,12}$/.test(form.phone)) return 'Phone must be 10–12 digits, numbers only.';
    if (!form.snumber) return 'Street number is required.';
    if (!form.stname)  return 'Street name is required.';
    if (!form.date)    return 'Pickup date is required.';
    if (!form.time)    return 'Pickup time is required.';

    const [d, m, y] = form.date.split('/');
    const pickup = new Date(`${y}-${m}-${d}T${form.time}`);
    if (pickup < new Date()) return 'Pickup date/time cannot be in the past.';

    return null;
  }

  function handleSubmit() {
    setError('');
    setConfirm(null);

    const err = validate();
    if (err) { setError(err); return; }

    const brn = generateBRN();
    const booking = {
      brn, ...form,
      booking_datetime: new Date().toISOString(),
      status: 'unassigned'
    };

    // Save to localStorage (demo storage)
    const all = JSON.parse(localStorage.getItem('bookings') || '[]');
    all.push(booking);
    localStorage.setItem('bookings', JSON.stringify(all));

    setConfirm(booking);
    // Reset form
    setForm({ cname: '', phone: '', unumber: '', snumber: '', stname: '', sbname: '', dsbname: '', date: getTodayDate(), time: getCurrentTime() });
  }

  return (
    <div>
      <div className="card">
        <h2>🚕 Book a Taxi</h2>
        <div className="form-grid">
          <div>
            <label>Customer Name *</label>
            <input name="cname" value={form.cname} onChange={handleChange} placeholder="e.g. John Smith" />
          </div>
          <div>
            <label>Phone Number * (10–12 digits)</label>
            <input name="phone" value={form.phone} onChange={handleChange} placeholder="e.g. 0211234567" />
          </div>
          <div>
            <label>Unit Number (optional)</label>
            <input name="unumber" value={form.unumber} onChange={handleChange} placeholder="e.g. 4B" />
          </div>
          <div>
            <label>Street Number *</label>
            <input name="snumber" value={form.snumber} onChange={handleChange} placeholder="e.g. 123" />
          </div>
          <div className="form-full">
            <label>Street Name *</label>
            <input name="stname" value={form.stname} onChange={handleChange} placeholder="e.g. Queen Street" />
          </div>
          <div>
            <label>Suburb (optional)</label>
            <input name="sbname" value={form.sbname} onChange={handleChange} placeholder="e.g. Auckland CBD" />
          </div>
          <div>
            <label>Destination Suburb (optional)</label>
            <input name="dsbname" value={form.dsbname} onChange={handleChange} placeholder="e.g. Northcote" />
          </div>
          <div>
            <label>Pickup Date *</label>
            <input name="date" value={form.date} onChange={handleChange} placeholder="dd/mm/yyyy" />
          </div>
          <div>
            <label>Pickup Time * (24h HH:MM)</label>
            <input type="time" name="time" value={form.time} onChange={handleChange} />
          </div>
          <div className="form-full">
            <button className="submit-btn" onClick={handleSubmit}>Book Now</button>
          </div>
        </div>
        {error && <p className="error">⚠️ {error}</p>}
      </div>

      {confirm && (
        <div className="card booking-confirm" id="reference">
          <p><strong>✅ Thank you for your booking!</strong></p>
          <p id="reference">
            Booking reference number: <strong>{confirm.brn}</strong><br />
            Pickup time: {confirm.time}<br />
            Pickup date: {confirm.date}
          </p>
        </div>
      )}
    </div>
  );
}
