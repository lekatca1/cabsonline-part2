/**
 * App.js
 * CabsOnline Part 2 - Main React Application
 * Student: Robert | ID: 23217839
 *
 * Features:
 *   1. BookingForm   - Submit a taxi booking (extends Part 1)
 *   2. BookingTracker - Track booking status by BRN
 *   3. FareEstimator  - Estimate trip fare before booking
 *   4. DriverMap      - View driver locations on a map (Leaflet/OpenStreetMap)
 *   5. BookingHistory - View all past bookings in this session
 */

import React, { useState } from 'react';
import './App.css';
import BookingForm    from './components/BookingForm';
import BookingTracker from './components/BookingTracker';
import FareEstimator  from './components/FareEstimator';
import DriverMap      from './components/DriverMap';
import BookingHistory from './components/BookingHistory';

// Navigation tabs
const TABS = [
  { id: 'book',    label: '🚕 Book a Taxi' },
  { id: 'track',   label: '🔍 Track Booking' },
  { id: 'fare',    label: '💰 Fare Estimator' },
  { id: 'map',     label: '🗺️ Driver Map' },
  { id: 'history', label: '📋 History' },
];

export default function App() {
  const [tab, setTab] = useState('book');

  return (
    <div>
      {/* Header */}
      <div className="header">
        <h1>🚖 CabsOnline</h1>
        <span>Auckland Taxi Booking System</span>
      </div>

      {/* Navigation */}
      <div className="nav">
        {TABS.map(t => (
          <button
            key={t.id}
            className={tab === t.id ? 'active' : ''}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Page Content */}
      <div className="main">
        {tab === 'book'    && <BookingForm />}
        {tab === 'track'   && <BookingTracker />}
        {tab === 'fare'    && <FareEstimator />}
        {tab === 'map'     && <DriverMap />}
        {tab === 'history' && <BookingHistory />}
      </div>
    </div>
  );
}
