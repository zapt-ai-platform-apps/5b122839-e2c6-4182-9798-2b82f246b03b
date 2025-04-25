import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import * as Sentry from '@sentry/browser';

export function useFormHandling() {
  const [formData, setFormData] = useState({
    vehicleMake: '',
    vehicleModel: '',
    vehicleReg: '',
    ticketNumber: '',
    ticketDate: '',
    ticketReason: '',
    circumstances: '',
    keeperAddress: '',
    companyAddress: '',
    country: '',
    currency: 'GBP', // Default to GBP
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      console.log("Saving letter data before payment:", formData);
      
      // Get the current session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        throw new Error("Authentication required");
      }
      
      // Save letter data first
      const saveResponse = await fetch('/api/save-pending-letter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify(formData)
      });

      if (!saveResponse.ok) {
        const errorData = await saveResponse.json();
        throw new Error(errorData.error || 'Failed to save letter data');
      }

      const { letterId } = await saveResponse.json();
      console.log("Letter data saved with ID:", letterId);
      
      // Now create checkout session with letter ID and currency
      const checkoutResponse = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ 
          letterId,
          currency: formData.currency 
        })
      });

      if (!checkoutResponse.ok) {
        const errorData = await checkoutResponse.json();
        throw new Error(errorData.error || 'Failed to create checkout session');
      }

      const { url } = await checkoutResponse.json();
      console.log("Checkout session created, redirecting to payment");
      
      // Redirect to Stripe checkout
      window.location.href = url;
    } catch (error) {
      console.error('Form submission failed:', error);
      Sentry.captureException(error);
      setError(error.message || 'Failed to process your request. Please try again.');
      setLoading(false);
    }
  };

  return { formData, setFormData, loading, error, handleSubmit };
}