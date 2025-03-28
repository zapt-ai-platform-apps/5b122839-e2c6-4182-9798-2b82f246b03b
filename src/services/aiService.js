import { supabase } from '../supabaseClient';
import * as Sentry from '@sentry/browser';

export async function generateDisputeLetter(formData) {
  try {
    console.log("Requesting letter generation from backend API");
    
    // Get the current session
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token) {
      throw new Error("Authentication required");
    }
    
    // Call our backend API
    const response = await fetch('/api/generate-letter', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`
      },
      body: JSON.stringify(formData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to generate letter');
    }

    const data = await response.json();
    console.log("Letter generation successful");
    
    // Validate the required fields
    const { letter, summary } = data;
    if (!letter || !summary) {
      throw new Error(`Missing required fields in API response. Received: ${JSON.stringify(data)}`);
    }

    return { letter, summary };
  } catch (error) {
    console.error("AI service frontend error:", error);
    Sentry.captureException(error);
    throw error;
  }
}