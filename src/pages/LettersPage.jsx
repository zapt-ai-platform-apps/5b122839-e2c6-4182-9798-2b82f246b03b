import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import LoadingState from '../components/ui/LoadingState';
import ErrorState from '../components/ui/ErrorState';
import * as Sentry from '@sentry/browser';

export default function LettersPage() {
  const [letters, setLetters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLetters = async () => {
    try {
      console.log('Fetching letters...');
      setLoading(true);
      setError(null);
      
      const { data: { session } } = await supabase.auth.getSession();
      console.log('Auth session:', session ? 'Session found' : 'No session');
      
      if (!session?.access_token) {
        throw new Error('No valid auth session found');
      }
      
      const response = await fetch('/api/list-letters', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('API response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, ${errorText}`);
      }
      
      const data = await response.json();
      console.log('Letters fetched:', data.length);
      setLetters(data);
    } catch (error) {
      console.error('Fetch error:', error.message);
      Sentry.captureException(error);
      setError(`Error loading letters: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLetters();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold">My Dispute Letters</h1>
            <Link
              to="/form"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
            >
              Create New Letter
            </Link>
          </div>
          
          {loading ? (
            <LoadingState message="Loading your letters..." />
          ) : error ? (
            <ErrorState 
              message={error}
              onRetry={fetchLetters}
            />
          ) : letters.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="mb-4">No saved dispute letters found</p>
              <Link
                to="/form"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
              >
                Create Your First Letter
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {letters.map(letter => (
                <Link
                  key={letter.id}
                  to={`/output/${letter.id}`}
                  className="block p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">{letter.vehicleMake} {letter.vehicleModel}</h3>
                      <p className="text-sm text-gray-500">
                        Ticket #{letter.ticketNumber} - {new Date(letter.ticketDate).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-gray-400">
                        Created: {new Date(letter.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="text-blue-600">View →</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}