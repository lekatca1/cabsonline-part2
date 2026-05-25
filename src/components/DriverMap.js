/**
 * DriverMap.js
 * Feature 4: Driver Map View
 * Shows a map of Auckland with mock taxi driver locations.
 * Uses Leaflet (open-source, no API key needed).
 */

import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default marker icons for Leaflet in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl:       'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl:     'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Mock driver data (Auckland area)
const MOCK_DRIVERS = [
  { id: 'D001', name: 'Alice Tane',   lat: -36.8485, lng: 174.7633, status: 'online',  suburb: 'Auckland CBD',  car: 'Toyota Prius',   plate: 'ABC123' },
  { id: 'D002', name: 'Bob Ngata',    lat: -36.7996, lng: 174.7558, status: 'online',  suburb: 'Northcote',     car: 'Honda Civic',    plate: 'XYZ789' },
  { id: 'D003', name: 'Carol Smith',  lat: -36.8671, lng: 174.7680, status: 'offline', suburb: 'Newmarket',     car: 'Ford Focus',     plate: 'DEF456' },
  { id: 'D004', name: 'David Brown',  lat: -36.8745, lng: 174.7980, status: 'online',  suburb: 'Remuera',       car: 'Hyundai Ioniq',  plate: 'GHI012' },
  { id: 'D005', name: 'Eva Williams', lat: -36.8522, lng: 174.7200, status: 'online',  suburb: 'Ponsonby',      car: 'Tesla Model 3',  plate: 'JKL345' },
  { id: 'D006', name: 'Frank Lee',    lat: -36.8330, lng: 174.7384, status: 'offline', suburb: 'Grey Lynn',     car: 'Nissan Leaf',    plate: 'MNO678' },
];

// Create coloured marker icons
function makeIcon(colour) {
  return L.divIcon({
    html: `<div style="
      width:24px; height:24px; background:${colour};
      border:2px solid white; border-radius:50%;
      box-shadow: 0 2px 4px rgba(0,0,0,0.4);
    "></div>`,
    className: '',
    iconAnchor: [12, 12],
    popupAnchor: [0, -14],
  });
}

const onlineIcon  = makeIcon('#43a047');
const offlineIcon = makeIcon('#bdbdbd');

export default function DriverMap() {
  const [filter, setFilter] = useState('all');

  const shown = MOCK_DRIVERS.filter(d => filter === 'all' || d.status === filter);

  return (
    <div>
      <div className="card">
        <h2>🗺️ Driver Map View</h2>
        <p style={{ marginBottom: 16, color: '#555' }}>
          See where available drivers are in Auckland right now.
        </p>
        <div style={{ display: 'flex', gap: 10, marginBottom: 8 }}>
          {['all', 'online', 'offline'].map(f => (
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
              {f === 'online'  && ` (${MOCK_DRIVERS.filter(d => d.status === 'online').length})`}
              {f === 'offline' && ` (${MOCK_DRIVERS.filter(d => d.status === 'offline').length})`}
              {f === 'all'     && ` (${MOCK_DRIVERS.length})`}
            </button>
          ))}
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <MapContainer center={[-36.8485, 174.7633]} zoom={13} style={{ height: 420, borderRadius: 12 }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {shown.map(driver => (
            <Marker
              key={driver.id}
              position={[driver.lat, driver.lng]}
              icon={driver.status === 'online' ? onlineIcon : offlineIcon}
            >
              <Popup>
                <strong>{driver.name}</strong><br />
                ID: {driver.id}<br />
                Car: {driver.car}<br />
                Plate: {driver.plate}<br />
                Area: {driver.suburb}<br />
                Status: <span style={{ color: driver.status === 'online' ? '#43a047' : '#999', fontWeight: 'bold' }}>
                  {driver.status}
                </span>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <div className="card">
        <h2>Drivers</h2>
        <div className="driver-list">
          {shown.map(driver => (
            <div key={driver.id} className={`driver-card driver-${driver.status}`}>
              <div className="driver-name">{driver.name}</div>
              <div>🚗 {driver.car}</div>
              <div>🔑 {driver.plate}</div>
              <div>📍 {driver.suburb}</div>
              <div>ID: {driver.id}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
