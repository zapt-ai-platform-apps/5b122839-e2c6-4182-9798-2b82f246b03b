import React from 'react';
import { supabase } from '../supabaseClient';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { ChevronRightIcon } from '@heroicons/react/20/solid';

export default function Header({ user }) {
  return (
    <header className="bg-white shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-blue-600">Parking Disputer</h1>
            {user && <span className="text-sm text-gray-600">Welcome, {user.email}</span>}
          </div>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <button
                onClick={() => supabase.auth.signOut()}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Sign Out
              </button>
            ) : (
              <Auth
                supabaseClient={supabase}
                appearance={{ theme: ThemeSupa }}
                providers={['google']}
                redirectTo={window.location.origin}
                magicLink={true}
              />
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}