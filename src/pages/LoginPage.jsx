import React, { useEffect } from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '../supabaseClient';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import * as Sentry from '@sentry/browser';

export default function LoginPage({ user }) {
  const navigate = useNavigate();
  
  useEffect(() => {
    // If user is already logged in, redirect to the form page
    if (user) {
      navigate('/form', { replace: true });
    }
  }, [user, navigate]);

  const handleAuthSuccess = async () => {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        throw error;
      }
      
      if (data.session) {
        navigate('/form', { replace: true });
      }
    } catch (error) {
      console.error('Auth success handler error:', error);
      Sentry.captureException(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900">Sign In to Continue</h2>
          <p className="mt-2 text-sm text-gray-600">
            Secure authentication powered by ZAPT
          </p>
        </div>
        
        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#2563eb',
                  brandAccent: '#1d4ed8',
                },
                radii: {
                  borderRadiusButton: '12px',
                  inputBorderRadius: '12px',
                }
              }
            }
          }}
          providers={['google']}
          redirectTo={`${window.location.origin}/form`}
          magicLink={true}
          onSuccess={handleAuthSuccess}
        />
        
        <div className="mt-6 text-center text-sm">
          <a 
            href="https://www.zapt.ai" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-500 cursor-pointer"
          >
            Powered by ZAPT AI Platform
          </a>
        </div>
      </motion.div>
    </div>
  );
}