import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { motion } from 'framer-motion';
import useCopyToClipboard from '../hooks/useCopyToClipboard';
import ReactMarkdown from 'react-markdown';
import LoadingState from '../components/ui/LoadingState';
import ErrorState from '../components/ui/ErrorState';
import * as Sentry from '@sentry/browser';

export default function OutputPage() {
  const { id } = useParams();
  const [letter, setLetter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentRequired, setPaymentRequired] = useState(false);
  const [basicDetails, setBasicDetails] = useState(null);
  const navigate = useNavigate();
  const { copyToClipboard, copied } = useCopyToClipboard();

  useEffect(() => {
    const fetchLetter = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.access_token) {
          throw new Error('Authentication required');
        }
        
        const response = await fetch(`/api/get-letter?id=${id}`, {
          headers: {
            'Authorization': `Bearer ${session.access_token}`
          }
        });

        // Handle payment required response
        if (response.status === 402) {
          const data = await response.json();
          setPaymentRequired(true);
          setBasicDetails(data.basicDetails);
          setLoading(false);
          return;
        }
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch letter');
        }

        const data = await response.json();
        setLetter(data);
      } catch (error) {
        console.error('Error fetching letter:', error);
        Sentry.captureException(error);
        setError(error.message || 'Failed to fetch letter data');
      } finally {
        setLoading(false);
      }
    };

    fetchLetter();
  }, [id]);

  const handleCreateCheckout = async () => {
    setLoading(true);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        throw new Error('Authentication required');
      }
      
      // Create checkout session with letter ID
      const response = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ letterId: id })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create checkout session');
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error('Payment session creation failed:', error);
      Sentry.captureException(error);
      setError(error.message || 'Failed to process payment. Please try again.');
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingState message="Loading your dispute letter..." />;
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <ErrorState message={error} />
        <div className="text-center mt-8">
          <button 
            onClick={() => navigate('/letters')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors cursor-pointer"
          >
            View All Letters
          </button>
        </div>
      </div>
    );
  }

  if (paymentRequired && basicDetails) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm p-8"
        >
          <h2 className="text-2xl font-bold text-center mb-6">Payment Required</h2>
          
          <div className="mb-8 p-6 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold mb-3">Letter Details:</h3>
            <p><span className="font-medium">Vehicle:</span> {basicDetails.vehicleMake} {basicDetails.vehicleModel}</p>
            <p><span className="font-medium">Ticket Number:</span> {basicDetails.ticketNumber}</p>
            <p><span className="font-medium">Ticket Date:</span> {new Date(basicDetails.ticketDate).toLocaleDateString()}</p>
            <p><span className="font-medium">Created On:</span> {new Date(basicDetails.createdAt).toLocaleDateString()}</p>
          </div>
          
          <div className="text-center">
            <p className="mb-6 text-gray-700">
              You need to complete payment to access your personalized dispute letter.
            </p>
            
            <button
              onClick={handleCreateCheckout}
              disabled={loading}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 cursor-pointer"
            >
              {loading ? "Processing..." : "Complete Payment • £4.00"}
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-sm p-8"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Your Dispute Letter</h2>
          <button
            onClick={() => navigate('/letters')}
            className="text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
          >
            Back to Letters
          </button>
        </div>

        <div className="mb-8 p-6 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-3">Letter Summary:</h3>
          <ReactMarkdown className="prose max-w-none">
            {letter?.keySummary || ''}
          </ReactMarkdown>
        </div>

        <div className="relative bg-gray-50 p-6 rounded-lg mb-6">
          <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
            {letter?.generatedLetter || ''}
          </pre>
          <button
            onClick={() => copyToClipboard(letter?.generatedLetter || '')}
            className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            aria-label="Copy letter to clipboard"
          >
            {copied ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                <path d="M8 2a1 1 0 000 2h2a1 1 0 100-2H8z" />
                <path d="M3 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v6h-4.586l1.293-1.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L10.414 13H15v3a2 2 0 01-2 2H5a2 2 0 01-2-2V5zM15 11h2a1 1 0 110 2h-2v-2z" />
              </svg>
            )}
          </button>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-3">Ticket Details:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p><span className="font-medium">Vehicle:</span> {letter?.vehicleMake} {letter?.vehicleModel}</p>
              <p><span className="font-medium">Registration:</span> {letter?.vehicleReg}</p>
              <p><span className="font-medium">Ticket Number:</span> {letter?.ticketNumber}</p>
              <p><span className="font-medium">Date Issued:</span> {letter?.ticketDate ? new Date(letter.ticketDate).toLocaleDateString() : ''}</p>
              <p><span className="font-medium">Reason:</span> {letter?.ticketReason}</p>
            </div>
            <div>
              <p><span className="font-medium">Letter Created:</span> {letter?.createdAt ? new Date(letter.createdAt).toLocaleDateString() : ''}</p>
              <p><span className="font-medium">Country:</span> {letter?.country || 'United Kingdom'}</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}