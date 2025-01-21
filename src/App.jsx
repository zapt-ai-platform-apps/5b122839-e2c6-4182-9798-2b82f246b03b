import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import TicketForm from './components/TicketForm';
import HowItWorks from './components/HowItWorks';
import Footer from './components/Footer';

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

  if (loading) return <div className="min-h-screen bg-gray-50" />;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header user={user} />
      <main className="flex-1">
        <HeroSection />
        <TicketForm user={user} />
        <HowItWorks />
      </main>
      <Footer />
    </div>
  );
}