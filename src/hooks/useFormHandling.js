import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createCheckoutSession } from '../services/paymentService';
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
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      console.log("Creating payment session for:", formData);
      
      // Create checkout session and redirect to Stripe
      const { url } = await createCheckoutSession(formData);
      window.location.href = url;
    } catch (error) {
      console.error('Payment session creation failed:', error);
      Sentry.captureException(error);
      setError(error.message || 'Failed to create payment session. Please try again.');
      setLoading(false);
    }
  };

  return { formData, setFormData, loading, error, handleSubmit };
}