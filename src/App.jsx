import React, { useState, useEffect, useRef } from 'react';
import { supabase, recordLogin } from './supabaseClient';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import FormPage from './pages/FormPage';
import OutputPage from './pages/OutputPage';
import LettersPage from './pages/LettersPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import LoadingSpinner from './components/ui/LoadingSpinner';
import ChatWidget from './components/ChatWidget';
import * as Sentry from '@sentry/browser';

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasRecordedLogin, setHasRecordedLogin] = useState(false);
  const initialSessionCheckComplete = useRef(false);

  useEffect(() => {
    // Check initial auth state
    console.log('Checking initial auth state...');
    
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error checking session:', error);
          Sentry.captureException(error);
          setLoading(false);
          return;
        }
        
        console.log('Current session:', data.session ? 'Signed in' : 'No session');
        if (data.session?.user) {
          setUser(data.session.user);
        }
        initialSessionCheckComplete.current = true;
        setLoading(false);
      } catch (error) {
        console.error('Unexpected error checking session:', error);
        Sentry.captureException(error);
        setLoading(false);
      }
    };
    
    checkSession();
  }, []);
  
  // Separate useEffect for login recording to avoid race conditions
  useEffect(() => {
    if (user?.email && !hasRecordedLogin) {
      const recordUserLogin = async () => {
        try {
          await recordLogin(user.email, import.meta.env.VITE_PUBLIC_APP_ENV);
          console.log('User login recorded for:', user.email);
          setHasRecordedLogin(true);
        } catch (error) {
          console.error('Failed to record login:', error);
          Sentry.captureException(error);
        }
      };
      
      recordUserLogin();
    }
  }, [user, hasRecordedLogin]);
  
  // Separate useEffect for auth state listener to avoid conflicts
  useEffect(() => {
    console.log('Setting up auth state listener...');
    
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state change event:', event);
      
      if (event === 'SIGNED_OUT') {
        console.log('User signed out');
        setUser(null);
        setHasRecordedLogin(false);
      } else if (event === 'SIGNED_IN' && session) {
        console.log('User signed in:', session.user.email);
        setUser(session.user);
        setHasRecordedLogin(false);
      } else if (event === 'TOKEN_REFRESHED' && session) {
        console.log('Token refreshed for user');
        setUser(session.user);
      }
    });

    return () => {
      console.log('Cleanup: unsubscribing from auth listener');
      authListener?.subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <LoadingSpinner className="h-12 w-12" />
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col">
        <Header user={user} />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<LandingPage user={user} />} />
            <Route path="/login" element={<LoginPage user={user} />} />
            <Route path="/form" element={user ? <FormPage /> : <Navigate to="/login" replace />} />
            <Route path="/payment-success" element={user ? <PaymentSuccessPage /> : <Navigate to="/login" replace />} />
            <Route path="/output/:id" element={user ? <OutputPage /> : <Navigate to="/login" replace />} />
            <Route path="/letters" element={user ? <LettersPage /> : <Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
        {user && <ChatWidget user={user} />}
      </div>
    </Router>
  );
}