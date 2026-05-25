/**
 * App.js
 * CabsOnline Part 2 - Main React Application
 * Student: Robert | ID: 23217839
 */

import React, { useState } from 'react';
import './App.css';
import BookPage    from './components/BookPage';
import TrackPage   from './components/TrackPage';
import FarePage    from './components/FarePage';
import AdminPage   from './components/AdminPage';
import HistoryPage from './components/HistoryPage';

const TABS = [
  { id: 'book',    label: 'Book a Taxi'    },
  { id: 'track',   label: 'Track Booking'  },
  { id: 'fare',    label: 'Fare Estimator' },
  { id: 'admin',   label: 'Admin'          },
  { id: 'history', label: 'History'        },
];

export default function App() {
  const [tab, setTab] = useState('book');

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <h1>CabsOnline</h1>
          <p>Auckland Taxi System</p>
        </div>

        {TABS.map(t => (
          <button
            key={t.id}
            className={`nav-item ${tab === t.id ? 'active' : ''}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}

        <div className="sidebar-footer">
          Part 2 · React + Leaflet
        </div>
      </aside>

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
