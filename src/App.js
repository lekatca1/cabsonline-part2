/**
 * App.js
 * CabsOnline Part 2 - Main React Application
 * Student: Robert | ID: 23217839
 *
 * Pages:
 *   1. Book      - Booking form + driver map side by side
 *   2. Track     - Look up booking status by BRN
 *   3. Fare      - Estimate trip fare
 *   4. Admin     - Search bookings and assign taxis
 *   5. History   - View all past bookings this session
 */

import React, { useState } from 'react';
import './App.css';
import BookPage    from './components/BookPage';
import TrackPage   from './components/TrackPage';
import FarePage    from './components/FarePage';
import AdminPage   from './components/AdminPage';
import HistoryPage from './components/HistoryPage';

const TABS = [
  { id: 'book',    icon: '🚕', label: 'Book a Taxi'    },
  { id: 'track',   icon: '🔍', label: 'Track Booking'  },
  { id: 'fare',    icon: '💰', label: 'Fare Estimator' },
  { id: 'admin',   icon: '🛠', label: 'Admin'          },
  { id: 'history', icon: '📋', label: 'History'        },
];

export default function App() {
  const [tab, setTab] = useState('book');

  return (
    <div className="app">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <span className="logo-icon">🚖</span>
          <h1>CabsOnline</h1>
          <p>Auckland Taxi System</p>
        </div>

        {TABS.map(t => (
          <button
            key={t.id}
            className={`nav-item ${tab === t.id ? 'active' : ''}`}
            onClick={() => setTab(t.id)}
          >
            <span className="nav-icon">{t.icon}</span>
            {t.label}
          </button>
        ))}

        <div className="sidebar-footer">
          Part 2 · React + Leaflet<br />
          Demo data · localStorage
        </div>
      </aside>

      {/* Main */}
      <main className="main-content">
        {tab === 'book'    && <BookPage />}
        {tab === 'track'   && <TrackPage />}
        {tab === 'fare'    && <FarePage />}
        {tab === 'admin'   && <AdminPage />}
        {tab === 'history' && <HistoryPage />}
      </main>
    </div>
  );
}
