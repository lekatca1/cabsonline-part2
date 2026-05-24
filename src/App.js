/**
 * App.js
 * CabsOnline Part 2 - Main React Application
 * Student: Robert | ID: 23217839
 *
 * Features:
 *   1. BookingForm     - Submit a taxi booking (extends Part 1)
 *   2. BookingTracker  - Track booking status by BRN
 *   3. FareEstimator   - Estimate trip fare before booking
 *   4. DriverMap       - View driver locations on a map (Leaflet/OpenStreetMap)
 *   5. BookingHistory  - View all past bookings in this session
 *   6. AdminDashboard  - Search bookings and assign taxis (extends Part 1 admin)
 */

import React, { useState } from 'react';
import './App.css';
import BookingForm     from './components/BookingForm';
import BookingTracker  from './components/BookingTracker';
import FareEstimator   from './components/FareEstimator';
import DriverMap       from './components/DriverMap';
import BookingHistory  from './components/BookingHistory';
import AdminDashboard  from './components/AdminDashboard';

const TABS = [
  { id: 'book',    label: '🚕 Book a Taxi' },
  { id: 'track',   label: '🔍 Track Booking' },
  { id: 'fare',    label: '💰 Fare Estimator' },
  { id: 'map',     label: '🗺️ Driver Map' },
  { id: 'history', label: '📋 History' },
  { id: 'admin',   label: '🛠️ Admin' },
];

export default function App() {
  const [tab, setTab] = useState('book');

  return (
    <div>
      <div className="header">
        <h1>🚖 CabsOnline</h1>
        <span>Auckland Taxi Booking System</span>
      </div>

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

      <div className="main">
        {tab === 'book'    && <BookingForm />}
        {tab === 'track'   && <BookingTracker />}
        {tab === 'fare'    && <FareEstimator />}
        {tab === 'map'     && <DriverMap />}
        {tab === 'history' && <BookingHistory />}
        {tab === 'admin'   && <AdminDashboard />}
      </div>
    </div>
  );
}
