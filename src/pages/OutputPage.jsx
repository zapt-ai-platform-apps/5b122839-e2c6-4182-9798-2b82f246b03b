import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import useCopyToClipboard from '../hooks/useCopyToClipboard';
import OutputContent from '../components/OutputContent';
import { supabase } from '../supabaseClient';

export default function OutputPage() {
  const { id } = useParams();
  const [letterData, setLetterData] = useState(null);
  const [loading, setLoading] = useState(true);
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
        
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        setLetterData(data);
      } catch (error) {
        console.error('Fetch error:', error);
        navigate('/form');
      } finally {
        setLoading(false);
      }
    };

    fetchLetter();
  }, [id, navigate]);

  if (loading) return <LoadingSpinner className="h-12 w-12 mx-auto mt-16" />;

  return (
    <OutputContent
      letterData={letterData}
      copied={copied}
      handleCopy={handleCopy}
      navigate={navigate}
    />
  );
}