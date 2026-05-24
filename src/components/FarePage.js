/**
 * FarePage.js
 * Page 3: Fare Estimator
 * Calculates estimated fare between Auckland suburbs.
 */

import React, { useState } from 'react';

const SUBURBS = [
  { name: 'Auckland CBD',      km: 0  },
  { name: 'Ponsonby',          km: 2  },
  { name: 'Parnell',           km: 2  },
  { name: 'Grey Lynn',         km: 3  },
  { name: 'Mt Eden',           km: 4  },
  { name: 'Remuera',           km: 5  },
  { name: 'Onehunga',          km: 9  },
  { name: 'Northcote',         km: 8  },
  { name: 'Takapuna',          km: 11 },
  { name: 'Otahuhu',           km: 14 },
  { name: 'Henderson',         km: 18 },
  { name: 'Mangere',           km: 18 },
  { name: 'Airport (Mangere)', km: 21 },
  { name: 'Albany',            km: 22 },
  { name: 'Manukau',           km: 22 },
  { name: 'Papatoetoe',        km: 20 },
  { name: 'Botany',            km: 25 },
  { name: 'Howick',            km: 27 },
  { name: 'Papakura',          km: 35 },
];

export default function FarePage() {
  const [pickup, setPickup] = useState('');
  const [dest,   setDest]   = useState('');
  const [time,   setTime]   = useState('12:00');
  const [result, setResult] = useState(null);
  const [error,  setError]  = useState('');

  function estimate() {
    setError(''); setResult(null);
    if (!pickup || !dest)  { setError('Please select both suburbs.'); return; }
    if (pickup === dest)   { setError('Pickup and destination cannot be the same.'); return; }

    const from  = SUBURBS.find(s => s.name === pickup);
    const to    = SUBURBS.find(s => s.name === dest);
    const dist  = Math.round((Math.abs(from.km - to.km) + Math.max(from.km, to.km) * 0.3) * 10) / 10;
    const hour  = parseInt(time.split(':')[0]);
    const night = hour >= 22 || hour < 6;
    const sub   = 3.50 + dist * 2.20;
    const total = Math.round((night ? sub * 1.2 : sub) * 100) / 100;

    setResult({ dist, night, total: total.toFixed(2), min: (total * 0.9).toFixed(2), max: (total * 1.15).toFixed(2) });
  }

  return (
    <div>
      <h1 className="page-title">Fare Estimator</h1>
      <p className="page-subtitle">Get an estimated fare for your trip before you book.</p>

      <div className="card">
        <div className="card-title">Trip Details</div>
        <div className="form-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
          <div>
            <label>Pickup Suburb</label>
            <select value={pickup} onChange={e => setPickup(e.target.value)}>
              <option value="">Select suburb...</option>
              {SUBURBS.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
            </select>
          </div>
          <div>
            <label>Destination Suburb</label>
            <select value={dest} onChange={e => setDest(e.target.value)}>
              <option value="">Select suburb...</option>
              {SUBURBS.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
            </select>
          </div>
          <div>
            <label>Pickup Time</label>
            <input type="time" value={time} onChange={e => setTime(e.target.value)} />
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button className="btn-primary" onClick={estimate} style={{ marginBottom: 16 }}>
              Estimate Fare →
            </button>
          </div>
        </div>
        {error && <p className="msg-error">⚠ {error}</p>}
      </div>

      {result && (
        <div className="fare-result">
          <div className="label">Estimated Fare</div>
          <div className="amount">${result.total}</div>
          <div className="fare-breakdown">
            <span>📍 ~{result.dist} km</span>
            <span>🏁 $3.50 base + ${(result.dist * 2.20).toFixed(2)} distance</span>
            {result.night && <span>🌙 Night surcharge (20%) applied</span>}
            <span style={{ opacity: 0.5, fontSize: '0.8rem' }}>
              Typical range: ${result.min} – ${result.max}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
