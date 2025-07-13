import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { User, BarChart3, Brain, Target, Home } from 'lucide-react';

// Components
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import UserRegistration from './pages/UserRegistration';
import ContentBrowser from './pages/ContentBrowser';
import PersonalizedAds from './pages/PersonalizedAds';
import Analytics from './pages/Analytics';
import MLDashboard from './pages/MLDashboard';

// Context
import { UserContext } from './context/UserContext';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing user in localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('demo_user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('demo_user');
      }
    }
    setLoading(false);
  }, []);

  // Save user to localStorage when it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('demo_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('demo_user');
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Personalized Ads Demo...</p>
        </div>
      </div>
    );
  }

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Router>
        <div className="min-h-screen bg-gray-50">
          {user ? (
            <div className="flex">
              <Sidebar />
              <div className="flex-1 flex flex-col">
                <Header />
                <main className="flex-1 p-6">
                  <Routes>
                    <Route path="/" element={<ContentBrowser />} />
                    <Route path="/ads" element={<PersonalizedAds />} />
                    <Route path="/analytics" element={<Analytics />} />
                    <Route path="/ml" element={<MLDashboard />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </main>
              </div>
            </div>
          ) : (
            <UserRegistration />
          )}
        </div>
      </Router>
    </UserContext.Provider>
  );
}

export default App; 