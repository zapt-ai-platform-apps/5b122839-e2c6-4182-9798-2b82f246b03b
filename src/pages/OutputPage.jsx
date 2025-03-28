import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import LoadingState from '../components/ui/LoadingState';
import ErrorState from '../components/ui/ErrorState';
import useCopyToClipboard from '../hooks/useCopyToClipboard';
import OutputContent from '../components/OutputContent';
import { supabase } from '../supabaseClient';
import * as Sentry from '@sentry/browser';

export default function OutputPage() {
  const { id } = useParams();
  const [letterData, setLetterData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [copied, handleCopy] = useCopyToClipboard();

  const fetchLetter = async () => {
    try {
      console.log('Fetching letter details for ID:', id);
      setLoading(true);
      setError(null);
      
      const { data: { session } } = await supabase.auth.getSession();
      console.log('Auth session:', session ? 'Session found' : 'No session');
      
      if (!session?.access_token) {
        throw new Error('No valid auth session found');
      }
      
      const response = await fetch(`/api/get-letter?id=${id}`, {
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
      console.log('Letter fetched successfully');
      setLetterData(data);
      setError(null);
    } catch (error) {
      console.error('Fetch error:', error.message);
      Sentry.captureException(error);
      setError(`Failed to load letter: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLetter();
  }, [id]);

  if (loading) return <LoadingState message="Loading your letter..." />;
  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <ErrorState 
          message={error}
          onRetry={fetchLetter}
        />
        <div className="text-center mt-4">
          <button
            onClick={() => navigate('/letters')}
            className="text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
          >
            Back to My Letters
          </button>
        </div>
      </div>
    );
  }

  return (
    <OutputContent
      letterData={letterData}
      copied={copied}
      handleCopy={handleCopy}
      navigate={navigate}
    />
  );
}