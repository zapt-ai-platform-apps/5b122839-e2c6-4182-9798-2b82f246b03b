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
      // Generate letter content
      const gptResponse = await createEvent('chatgpt_request', {
        prompt: `Generate a parking dispute letter using this data: ${JSON.stringify(formData)}. 
          Structure response as: { 
            "letter": "full letter text in professional legal language", 
            "summary": "bullet point summary of key arguments" 
          }`,
        response_type: 'json'
      });

      if (!gptResponse.data?.letter || !gptResponse.data?.summary) {
        throw new Error('Invalid response from AI generator');
      }

      // Save to database
      const saveResponse = await fetch('/api/save-letter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          letter: gptResponse.data.letter,
          summary: gptResponse.data.summary
        }),
      });

      if (!saveResponse.ok) {
        throw new Error('Failed to save letter');
      }

      const { letterId } = await saveResponse.json();
      navigate(`/output/${letterId}`);
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