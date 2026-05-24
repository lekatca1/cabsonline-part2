/**
 * FareEstimator.js
 * Feature 3: Fare Estimator
 * Calculates estimated fare based on pickup and destination suburbs.
 * Uses pre-defined distances between Auckland suburbs.
 */

import React, { useState } from 'react';

// Pre-defined Auckland suburbs with approximate km distances from CBD
const SUBURBS = [
  { name: 'Auckland CBD',   km: 0 },
  { name: 'Northcote',      km: 8 },
  { name: 'Takapuna',       km: 11 },
  { name: 'Albany',         km: 22 },
  { name: 'Henderson',      km: 18 },
  { name: 'Manukau',        km: 22 },
  { name: 'Newmarket',      km: 3 },
  { name: 'Parnell',        km: 2 },
  { name: 'Remuera',        km: 5 },
  { name: 'Papatoetoe',     km: 20 },
  { name: 'Papakura',       km: 35 },
  { name: 'Botany',         km: 25 },
  { name: 'Howick',         km: 27 },
  { name: 'Mt Eden',        km: 4 },
  { name: 'Ponsonby',       km: 2 },
  { name: 'Grey Lynn',      km: 3 },
  { name: 'Onehunga',       km: 9 },
  { name: 'Otahuhu',        km: 14 },
  { name: 'Mangere',        km: 18 },
  { name: 'Airport (Mangere)', km: 21 },
];

const BASE_FARE  = 3.50;  // $ flag fall
const PER_KM     = 2.20;  // $ per km
const NIGHT_SURCHARGE = 1.2; // 20% extra after 10pm / before 6am

export default function FareEstimator() {
  const [pickup,  setPickup]  = useState('');
  const [dest,    setDest]    = useState('');
  const [time,    setTime]    = useState('12:00');
  const [result,  setResult]  = useState(null);
  const [error,   setError]   = useState('');

  function estimate() {
    setError('');
    setResult(null);

    if (!pickup || !dest) {
      setError('Please select both pickup and destination suburbs.');
      return;
    }
    if (pickup === dest) {
      setError('Pickup and destination cannot be the same suburb.');
      return;
    }

    const from = SUBURBS.find(s => s.name === pickup);
    const to   = SUBURBS.find(s => s.name === dest);

    // Estimate distance as absolute difference in km from CBD + some base
    const distKm = Math.abs(from.km - to.km) + Math.max(from.km, to.km) * 0.3;
    const roundedDist = Math.round(distKm * 10) / 10;

    // Check night surcharge
    const hour = parseInt(time.split(':')[0]);
    const isNight = hour >= 22 || hour < 6;

    const subtotal = BASE_FARE + roundedDist * PER_KM;
    const total    = isNight ? subtotal * NIGHT_SURCHARGE : subtotal;
    const rounded  = Math.round(total * 100) / 100;

    setResult({
      distKm:     roundedDist,
      base:       BASE_FARE.toFixed(2),
      perKm:      (roundedDist * PER_KM).toFixed(2),
      isNight,
      total:      rounded.toFixed(2),
      minFare:    (rounded * 0.9).toFixed(2),
      maxFare:    (rounded * 1.15).toFixed(2),
    });
  }

  return (
    <div>
      <div className="card">
        <h2>💰 Fare Estimator</h2>
        <p style={{ marginBottom: 16, color: '#555' }}>
          Get an estimated fare for your trip before you book.
        </p>

        <div className="form-grid">
          <div>
            <label>Pickup Suburb</label>
            <select value={pickup} onChange={e => setPickup(e.target.value)}>
              <option value="">-- Select suburb --</option>
              {SUBURBS.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
            </select>
          </div>
          <div>
            <label>Destination Suburb</label>
            <select value={dest} onChange={e => setDest(e.target.value)}>
              <option value="">-- Select suburb --</option>
              {SUBURBS.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
            </select>
          </div>
          <div>
            <label>Pickup Time (for night surcharge check)</label>
            <input type="time" value={time} onChange={e => setTime(e.target.value)} />
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button
              style={{ background: '#1a237e', color: 'white', width: '100%', padding: '10px', borderRadius: '8px', marginBottom: '12px' }}
              onClick={estimate}
            >
              Estimate Fare
            </button>
          </div>
        </div>

        {error && <p className="error">⚠️ {error}</p>}
      </div>

      {result && (
        <div className="fare-result">
          <p style={{ marginBottom: 8 }}>Estimated Fare</p>
          <div className="amount">${result.total}</div>
          <div className="breakdown">
            <div>📍 Distance: ~{result.distKm} km</div>
            <div>🏁 Base fare: ${result.base}</div>
            <div>🛣️ Distance charge: ${result.perKm}</div>
            {result.isNight && <div>🌙 Night surcharge (20%) applied</div>}
            <div style={{ marginTop: 8, opacity: 0.7, fontSize: '0.8rem' }}>
              Typical range: ${result.minFare} – ${result.maxFare} (traffic may vary)
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
