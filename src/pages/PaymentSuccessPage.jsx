import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import LoadingState from '../components/ui/LoadingState';
import ErrorState from '../components/ui/ErrorState';
import * as Sentry from '@sentry/browser';

export default function PaymentSuccessPage() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const letterId = searchParams.get('letter_id');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyPayment = async () => {
      if (!sessionId || !letterId) {
        setError('Missing payment information');
        setLoading(false);
        return;
      }

      try {
        console.log("Verifying payment for letter ID:", letterId);
        
        // Get the current session
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.access_token) {
          throw new Error("Authentication required");
        }
        
        // Verify payment and update letter
        const response = await fetch('/api/verify-payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`
          },
          body: JSON.stringify({ 
            sessionId,
            letterId
          })
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Payment verification failed');
        }

        const data = await response.json();
        console.log("Payment verified successfully");
        
        // Navigate to the output page to view the letter
        navigate(`/output/${data.letterId}`);
      } catch (error) {
        console.error('Payment verification failed:', error);
        Sentry.captureException(error);
        setError(error.message || 'Failed to verify payment. Please contact support.');
        setLoading(false);
      }
    };

    verifyPayment();
  }, [sessionId, letterId, navigate]);

  if (loading) {
    return <LoadingState message="Verifying your payment and generating your dispute letter..." />;
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <ErrorState message={error} />
        <div className="text-center mt-8">
          <button
            onClick={() => navigate('/form')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors cursor-pointer"
          >
            Return to Form
          </button>
        </div>
      </div>
    );
  }

  return null; // This will not render as successful processing redirects to output page
}