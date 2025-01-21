import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Sentry from '@sentry/browser';
import { generateDisputeLetter } from '../services/aiService';
import { saveLetter } from '../services/letterService';

export function useFormHandling() {
  const [formData, setFormData] = useState({
    vehicleMake: '',
    vehicleModel: '',
    ticketNumber: '',
    ticketDate: '',
    ticketReason: '',
    circumstances: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { letter, summary } = await generateDisputeLetter(formData);
      
      const { letterId } = await saveLetter({
        formData,
        letter,
        summary
      });

      navigate(`/output/${letterId}`);
    } catch (error) {
      Sentry.captureException(error);
      console.error('Submission error:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return { formData, setFormData, loading, handleSubmit };
}