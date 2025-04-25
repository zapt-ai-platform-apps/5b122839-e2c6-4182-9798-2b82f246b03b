import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { motion } from 'framer-motion';
import useCopyToClipboard from '../hooks/useCopyToClipboard';
import ReactMarkdown from 'react-markdown';
import LoadingState from '../components/ui/LoadingState';
import ErrorState from '../components/ui/ErrorState';
import CopyLetterButton from '../components/CopyLetterButton';
import * as Sentry from '@sentry/browser';
import { DocumentArrowDownIcon } from '@heroicons/react/24/outline';

export default function OutputPage() {
  const { id } = useParams();
  const [letter, setLetter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentRequired, setPaymentRequired] = useState(false);
  const [basicDetails, setBasicDetails] = useState(null);
  const navigate = useNavigate();
  const [copied, copyToClipboard] = useCopyToClipboard();

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

  const handleDownload = () => {
    if (!letter?.generatedLetter) return;
    
    const element = document.createElement('a');
    const file = new Blob([letter.generatedLetter], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `dispute-letter-${letter.ticketNumber}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
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

        {/* Letter content with highlighted action buttons */}
        <div className="relative bg-gray-50 p-6 rounded-lg mb-6">
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-white border border-gray-200 rounded-lg shadow-md py-2 px-4 flex gap-4 z-10">
            <CopyLetterButton 
              copied={copied} 
              onClick={() => copyToClipboard(letter?.generatedLetter || '')}
            />
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors cursor-pointer"
            >
              <DocumentArrowDownIcon className="h-5 w-5" />
              <span>Download</span>
            </button>
          </div>
          
          <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed pt-8">
            {letter?.generatedLetter || ''}
          </pre>
        </div>

        {/* Letter actions in footer */}
        <div className="mt-8 pt-4 border-t border-gray-200">
          <div className="flex justify-end">
            <div className="flex gap-3">
              <button
                onClick={() => navigate('/form')}
                className="text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
              >
                Create New Letter
              </button>
              
              <CopyLetterButton 
                copied={copied} 
                onClick={() => copyToClipboard(letter?.generatedLetter || '')}
                className="hidden sm:flex" // Hide on mobile, already shown above
              />
            </div>
          </div>
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