import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateDisputeLetter } from '../services/aiService';
import { saveLetter } from '../services/letterService';
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
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      console.log("Generating letter for:", formData);
      
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
      console.error('Letter generation failed:', error);
      Sentry.captureException(error);
      setError(error.message || 'Failed to generate letter. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return { formData, setFormData, loading, error, handleSubmit };
}