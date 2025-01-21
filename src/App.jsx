import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import FormPage from './pages/FormPage';
import OutputPage from './pages/OutputPage';
import LettersPage from './pages/LettersPage';
import LoadingSpinner from './components/ui/LoadingSpinner';

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => authListener?.subscription.unsubscribe();
  }, []);

  if (loading) return <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white" />;

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col">
        <Header user={user} />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<LandingPage user={user} />} />
            <Route path="/login" element={<LoginPage user={user} />} />
            <Route
              path="/form"
              element={user ? <FormPage /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/output/:id"
              element={user ? <OutputPage /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/letters"
              element={user ? <LettersPage /> : <Navigate to="/login" replace />}
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}