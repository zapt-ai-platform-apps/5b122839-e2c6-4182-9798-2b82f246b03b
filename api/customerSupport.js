import { initializeZapt } from '@zapt/zapt-js';
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.VITE_PUBLIC_SENTRY_DSN,
  environment: process.env.VITE_PUBLIC_APP_ENV,
  initialScope: {
    tags: {
      type: 'backend',
      projectId: process.env.VITE_PUBLIC_APP_ID
    }
  }
});

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    if (!process.env.ZAPT_SECRET_KEY) {
      return res.status(500).json({ error: 'Missing secret key configuration' });
    }

    // Initialize the ZAPT helper (used for support service)
    const { supabase, createEvent } = initializeZapt(process.env.VITE_PUBLIC_APP_ID);
    
    // Simulate retrieval of support chat credentials using the secret key and email.
    // In a real-world scenario, this would contact the customer support service.
    const token = 'support-token-' + email;
    const channelId = 'support-channel';
    const userId = email;

    res.status(200).json({ token, channelId, userId });
  } catch (error) {
    Sentry.captureException(error);
    console.error('Customer support API error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}