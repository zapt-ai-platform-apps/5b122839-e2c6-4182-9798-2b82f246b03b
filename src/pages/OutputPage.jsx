import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/ui/LoadingSpinner';
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

  useEffect(() => {
    const fetchLetter = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        const response = await fetch(`/api/get-letter?id=${id}`, {
          headers: {
            'Authorization': `Bearer ${session?.access_token}`
          }
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP error! status: ${response.status}, ${errorText}`);
        }
        
        const data = await response.json();
        setLetterData(data);
        setError(null);
      } catch (error) {
        Sentry.captureException(error);
        console.error('Fetch error:', error);
        setError('Failed to load letter');
        navigate('/letters');
      } finally {
        setLoading(false);
      }
    };

    fetchLetter();
  }, [id, navigate]);

  if (loading) return <LoadingSpinner className="h-12 w-12 mx-auto mt-16" />;
  if (error) return <div className="text-center py-16 text-red-600">{error}</div>;

  return (
    <OutputContent
      letterData={letterData}
      copied={copied}
      handleCopy={handleCopy}
      navigate={navigate}
    />
  );
}