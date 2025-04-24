import { supabase } from '../supabaseClient';
import * as Sentry from '@sentry/browser';

export async function createCheckoutSession(formData) {
  try {
    console.log("Creating checkout session");
    
    // Get the current session
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token) {
      throw new Error("Authentication required");
    }
    
    // Call our backend API
    const response = await fetch('/api/create-checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`
      },
      body: JSON.stringify({ formData })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create checkout session');
    }

    const data = await response.json();
    console.log("Checkout session created successfully");
    
    return data;
  } catch (error) {
    console.error("Payment service error:", error);
    Sentry.captureException(error);
    throw error;
  }
}