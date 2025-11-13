import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import ErrorBoundary from './ErrorBoundary';
import './App.css';

import { Home } from './components/Home';
import Login from './components/Auth/Login.jsx';
import Register from './components/Auth/Register.jsx';
import Profile from './components/Profile/Profile.jsx';
import AdDetail from './components/Ads/AdDetail.jsx';
import AdForm from './components/Ads/AdForm.jsx';

function App() {
  useEffect(() => {
    if (typeof window !== 'undefined' && typeof window.handleRoutes === 'function') {
      window.handleRoutes(['/', '/login', '/register', '/profile', '/ads/new', '/ads/:id', '/ads/:id/edit']);
    }
  }, []);

  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/ads/new" element={<AdForm />} />
        <Route path="/ads/:id" element={<AdDetail />} />
        <Route path="/ads/:id/edit" element={<AdForm />} />
      </Routes>
    </ErrorBoundary>
  );
}

export default App;
