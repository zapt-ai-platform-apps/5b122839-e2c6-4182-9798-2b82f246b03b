import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createEvent } from '../supabaseClient';
import * as Sentry from '@sentry/browser';

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
      const response = await createEvent('chatgpt_request', {
        prompt: `Generate a parking dispute letter using this data: ${JSON.stringify(formData)}. 
          Structure response as: { "letter": "full letter text", "summary": "key points summary" }`,
        response_type: 'json'
      });

      if (response.data) {
        navigate('/output', { state: response.data });
      }
    } catch (error) {
      Sentry.captureException(error);
      console.error('Submission error:', error);
      alert('Error generating letter. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return { formData, setFormData, loading, handleSubmit };
}