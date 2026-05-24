/**
 * BookPage.js
 * Page 1: Book a Taxi + Driver Map (side by side)
 * Left: booking form. Right: live driver map (Leaflet/OpenStreetMap).
 * Stores bookings in localStorage for demo purposes.
 */

import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default marker icons in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl:       'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl:     'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Mock drivers around Auckland
const DRIVERS = [
  { id: 'D001', name: 'Alice Tane',   lat: -36.8485, lng: 174.7633, status: 'online',  suburb: 'Auckland CBD', car: 'Toyota Prius',  plate: 'ABC123' },
  { id: 'D002', name: 'Bob Ngata',    lat: -36.7996, lng: 174.7558, status: 'online',  suburb: 'Northcote',    car: 'Honda Civic',   plate: 'XYZ789' },
  { id: 'D003', name: 'Carol Smith',  lat: -36.8671, lng: 174.7680, status: 'offline', suburb: 'Newmarket',    car: 'Ford Focus',    plate: 'DEF456' },
  { id: 'D004', name: 'David Brown',  lat: -36.8745, lng: 174.7980, status: 'online',  suburb: 'Remuera',      car: 'Hyundai Ioniq', plate: 'GHI012' },
  { id: 'D005', name: 'Eva Williams', lat: -36.8522, lng: 174.7200, status: 'online',  suburb: 'Ponsonby',     car: 'Tesla Model 3', plate: 'JKL345' },
  { id: 'D006', name: 'Frank Lee',    lat: -36.8330, lng: 174.7010, status: 'offline', suburb: 'Grey Lynn',    car: 'Nissan Leaf',   plate: 'MNO678' },
];

// Coloured circle marker
function makeIcon(colour) {
  return L.divIcon({
    html: `<div style="width:18px;height:18px;background:${colour};border:2px solid #fff;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,0.5)"></div>`,
    className: '',
    iconAnchor: [9, 9],
    popupAnchor: [0, -12],
  });
}

const onlineIcon  = makeIcon('#4caf50');
const offlineIcon = makeIcon('#555');

// Helpers
function todayStr() {
  const n = new Date();
  return `${String(n.getDate()).padStart(2,'0')}/${String(n.getMonth()+1).padStart(2,'0')}/${n.getFullYear()}`;
}
function nowTime() {
  const n = new Date();
  return `${String(n.getHours()).padStart(2,'0')}:${String(n.getMinutes()).padStart(2,'0')}`;
}
function nextBRN() {
  const all = JSON.parse(localStorage.getItem('bookings') || '[]');
  return 'BRN' + String(all.length + 1).padStart(5, '0');
}

export default function BookPage() {
  const [form, setForm] = useState({
    cname:'', phone:'', unumber:'', snumber:'',
    stname:'', sbname:'', dsbname:'',
    date: todayStr(), time: nowTime()
  });
  const [error,   setError]   = useState('');
  const [confirm, setConfirm] = useState(null);

  useEffect(() => {
    setForm(f => ({ ...f, date: todayStr(), time: nowTime() }));
  }, []);

  function change(e) { setForm({ ...form, [e.target.name]: e.target.value }); }

  function validate() {
    if (!form.cname)                          return 'Customer name is required.';
    if (!form.phone)                          return 'Phone number is required.';
    if (!/^\d{10,12}$/.test(form.phone))      return 'Phone must be 10–12 digits, numbers only.';
    if (!form.snumber)                        return 'Street number is required.';
    if (!form.stname)                         return 'Street name is required.';
    if (!form.date)                           return 'Pickup date is required.';
    if (!form.time)                           return 'Pickup time is required.';
    const [d,m,y] = form.date.split('/');
    if (new Date(`${y}-${m}-${d}T${form.time}`) < new Date()) return 'Pickup date/time cannot be in the past.';
    return null;
  }

  function submit() {
    setError(''); setConfirm(null);
    const err = validate();
    if (err) { setError(err); return; }

    const booking = { brn: nextBRN(), ...form, booking_datetime: new Date().toISOString(), status: 'unassigned' };
    const all = JSON.parse(localStorage.getItem('bookings') || '[]');
    localStorage.setItem('bookings', JSON.stringify([...all, booking]));
    setConfirm(booking);
    setForm({ cname:'', phone:'', unumber:'', snumber:'', stname:'', sbname:'', dsbname:'', date: todayStr(), time: nowTime() });
  }

  const onlineCount = DRIVERS.filter(d => d.status === 'online').length;

  return (
    <div>
      <h1 className="page-title">Book a Taxi</h1>
      <p className="page-subtitle">{onlineCount} drivers available near you right now</p>

      <div className="book-layout">
        {/* ── LEFT: Booking Form ── */}
        <div>
          <div className="card">
            <div className="card-title">Your Details</div>
            <div className="form-grid-2">
              <div className="form-full">
                <label>Customer Name *</label>
                <input name="cname" value={form.cname} onChange={change} placeholder="John Smith" />
              </div>
              <div className="form-full">
                <label>Phone Number * (10–12 digits)</label>
                <input name="phone" value={form.phone} onChange={change} placeholder="0211234567" />
              </div>
              <div>
                <label>Unit No. (optional)</label>
                <input name="unumber" value={form.unumber} onChange={change} placeholder="4B" />
              </div>
              <div>
                <label>Street Number *</label>
                <input name="snumber" value={form.snumber} onChange={change} placeholder="123" />
              </div>
              <div className="form-full">
                <label>Street Name *</label>
                <input name="stname" value={form.stname} onChange={change} placeholder="Queen Street" />
              </div>
              <div>
                <label>Pickup Suburb</label>
                <input name="sbname" value={form.sbname} onChange={change} placeholder="Auckland CBD" />
              </div>
              <div>
                <label>Destination Suburb</label>
                <input name="dsbname" value={form.dsbname} onChange={change} placeholder="Northcote" />
              </div>
              <div>
                <label>Pickup Date *</label>
                <input name="date" value={form.date} onChange={change} placeholder="dd/mm/yyyy" />
              </div>
              <div>
                <label>Pickup Time *</label>
                <input type="time" name="time" value={form.time} onChange={change} />
              </div>
            </div>

            {error && <p className="msg-error">⚠ {error}</p>}
            <div style={{ marginTop: 8 }}>
              <button className="btn-primary" onClick={submit}>Book Now →</button>
            </div>
          </div>

          {/* Confirmation */}
          {confirm && (
            <div className="confirm-box" id="reference">
              <div className="brn">{confirm.brn}</div>
              <p id="reference">
                ✅ Booking confirmed!<br />
                Booking reference number: {confirm.brn}<br />
                Pickup date: {confirm.date}<br />
                Pickup time: {confirm.time}
              </p>
            </div>
          )}
        </div>

        {/* ── RIGHT: Driver Map ── */}
        <div className="map-panel">
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <MapContainer center={[-36.8485, 174.7633]} zoom={13} style={{ height: 460 }}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {DRIVERS.map(d => (
                <Marker key={d.id} position={[d.lat, d.lng]} icon={d.status === 'online' ? onlineIcon : offlineIcon}>
                  <Popup>
                    <strong>{d.name}</strong><br />
                    {d.car} · {d.plate}<br />
                    {d.suburb}<br />
                    <span style={{ color: d.status === 'online' ? '#4caf50' : '#999', fontWeight: 'bold' }}>
                      {d.status}
                    </span>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>

          {/* Driver pills */}
          <div className="driver-pills">
            {DRIVERS.map(d => (
              <div key={d.id} className="driver-pill">
                <div className={`dot dot-${d.status}`} />
                <span>{d.name.split(' ')[0]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
