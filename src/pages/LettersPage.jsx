import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { motion } from 'framer-motion';
import LoadingState from '../components/ui/LoadingState';
import ErrorState from '../components/ui/ErrorState';
import CurrencySelector from '../components/CurrencySelector';
import * as Sentry from '@sentry/browser';

export default function LettersPage() {
  const [letters, setLetters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingLetterId, setProcessingLetterId] = useState(null);
  const [showCurrencySelector, setShowCurrencySelector] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState('GBP');
  const [selectedLetterId, setSelectedLetterId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLetters = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.access_token) {
          throw new Error('Authentication required');
        }
        
        const response = await fetch('/api/list-letters', {
          headers: {
            'Authorization': `Bearer ${session.access_token}`
          }
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch letters');
        }

        const data = await response.json();
        setLetters(data);
      } catch (error) {
        console.error('Error fetching letters:', error);
        Sentry.captureException(error);
        setError(error.message || 'Failed to fetch your letters');
      } finally {
        setLoading(false);
      }
    };

    fetchLetters();
  }, []);

  const initiatePayment = (letterId) => {
    setSelectedLetterId(letterId);
    setShowCurrencySelector(true);
  };

  const handleContinuePayment = async (letterId, currency) => {
    setProcessingLetterId(letterId);
    setShowCurrencySelector(false);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        throw new Error('Authentication required');
      }
      
      // Create checkout session with letter ID and currency
      const response = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ 
          letterId,
          currency 
        })
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
      setProcessingLetterId(null);
    }
  };

  if (loading) {
    return <LoadingState message="Loading your dispute letters..." />;
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <ErrorState message={error} />
        <div className="text-center mt-8">
          <button 
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors cursor-pointer"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  if (letters.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <h2 className="text-2xl font-bold mb-4">Your Dispute Letters</h2>
          <p className="text-gray-600 mb-6">You haven't created any dispute letters yet.</p>
          <button 
            onClick={() => navigate('/form')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors cursor-pointer"
          >
            Create Your First Letter
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {showCurrencySelector && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        >
          <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Select Payment Currency</h3>
            <CurrencySelector 
              selectedCurrency={selectedCurrency}
              onChange={setSelectedCurrency}
            />
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowCurrencySelector(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleContinuePayment(selectedLetterId, selectedCurrency)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer"
              >
                Continue to Payment
              </button>
            </div>
          </div>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-sm p-8"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Your Dispute Letters</h2>
          <button 
            onClick={() => navigate('/form')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer text-sm"
          >
            Create New Letter
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vehicle
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ticket Number
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {letters.map((letter) => (
                <tr key={letter.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{letter.vehicleMake} {letter.vehicleModel}</div>
                    <div className="text-sm text-gray-500">{letter.vehicleReg}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {letter.ticketNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(letter.ticketDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {letter.paymentStatus === 'paid' ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Paid
                      </span>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        Pending Payment
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {letter.paymentStatus === 'paid' ? (
                      <Link to={`/output/${letter.id}`} className="text-blue-600 hover:text-blue-900 cursor-pointer">
                        View
                      </Link>
                    ) : (
                      <button 
                        onClick={() => initiatePayment(letter.id)}
                        disabled={processingLetterId === letter.id}
                        className="text-blue-600 hover:text-blue-900 cursor-pointer disabled:text-gray-400"
                      >
                        {processingLetterId === letter.id ? 'Processing...' : 'Complete Payment'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}