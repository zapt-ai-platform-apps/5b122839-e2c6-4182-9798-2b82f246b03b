import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import * as Sentry from '@sentry/browser';

export default function LettersPage() {
  const [letters, setLetters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLetters = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        const response = await fetch('/api/list-letters', {
          headers: {
            'Authorization': `Bearer ${session?.access_token}`
          }
        });
        
        if (!response.ok) throw new Error('Failed to fetch letters');
        const data = await response.json();
        setLetters(data);
      } catch (error) {
        Sentry.captureException(error);
        console.error('Fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLetters();
  }, []);

  if (loading) return <LoadingSpinner className="h-12 w-12 mx-auto mt-16" />;

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-2xl font-bold mb-8">My Dispute Letters</h1>
          
          {letters.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No saved dispute letters found
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