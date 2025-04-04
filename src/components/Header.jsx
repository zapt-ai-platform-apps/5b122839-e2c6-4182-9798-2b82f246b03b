import React from 'react';
import { supabase } from '../supabaseClient';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as Sentry from '@sentry/browser';

export default function Header({ user }) {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      console.log('Signing out...');
      const { error } = await supabase.auth.signOut({
        scope: 'local' // Only clear local session, not all devices
      });
      if (error) {
        throw error;
      }
      console.log('Sign out successful');
      navigate('/');
    } catch (error) {
      console.error('Sign out failed:', error);
      Sentry.captureException(error);
      alert('Failed to sign out. Please try again.');
    }
  };

  return (
    <header className="bg-white shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="flex items-center space-x-2 cursor-pointer">
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Parking Disputer
            </span>
          </Link>
          
          <div className="flex items-center space-x-4">
            {user && (
              <Link
                to="/letters"
                className="text-gray-600 hover:text-blue-600 transition-colors cursor-pointer"
              >
                My Letters
              </Link>
            )}
            {user ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSignOut}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
              >
                Sign Out
              </motion.button>
            ) : (
              <Link
                to="/login"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}