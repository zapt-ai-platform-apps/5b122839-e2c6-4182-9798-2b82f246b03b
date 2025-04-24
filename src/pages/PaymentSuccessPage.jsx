import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { generateDisputeLetter } from '../services/aiService';
import { saveLetter } from '../services/letterService';
import LoadingState from '../components/ui/LoadingState';
import ErrorState from '../components/ui/ErrorState';
import * as Sentry from '@sentry/browser';

export default function PaymentSuccessPage() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const formDataString = searchParams.get('form_data');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const processPayment = async () => {
      if (!sessionId || !formDataString) {
        setError('Missing required payment information');
        setLoading(false);
        return;
      }

      try {
        // Parse the form data
        const formData = JSON.parse(decodeURIComponent(formDataString));
        
        console.log("Payment successful, generating letter for:", formData);
        
        // Generate the letter using AI
        const { letter, summary } = await generateDisputeLetter(formData);
        console.log("Letter generated successfully");
        
        // Save the letter to the database
        const { letterId } = await saveLetter({ 
          formData, 
          letter, 
          summary 
        });
        console.log("Letter saved with ID:", letterId);
        
        // Navigate to the output page to view the letter
        navigate(`/output/${letterId}`);
      } catch (error) {
        console.error('Letter generation failed after payment:', error);
        Sentry.captureException(error);
        setError(error.message || 'Failed to generate letter. Please contact support.');
        setLoading(false);
      }
    };

    processPayment();
  }, [sessionId, formDataString, navigate]);

  if (loading) {
    return <LoadingState message="Processing your payment and generating your dispute letter..." />;
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