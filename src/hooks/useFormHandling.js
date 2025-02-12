import { useState } from 'react';

export function useFormHandling() {
  const [formData, setFormData] = useState({
    vehicleMake: '',
    vehicleModel: '',
    ticketNumber: '',
    ticketDate: '',
    ticketReason: '',
    circumstances: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Form submitted:", formData);
    setLoading(false);
  };

  return { formData, setFormData, loading, handleSubmit };
}