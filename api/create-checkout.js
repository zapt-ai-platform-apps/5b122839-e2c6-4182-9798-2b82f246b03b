import { authenticateUser } from './_apiUtils.js';
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
    console.log('API: Create checkout session request received');
    
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    // Authenticate the user
    const user = await authenticateUser(req);
    console.log(`API: User authenticated: ${user.id}`);

    // Get form data from the request
    const { formData, currency = 'GBP' } = req.body;
    if (!formData) {
      return res.status(400).json({ error: 'Form data is required' });
    }

    const stripe = require('stripe')(process.env.STRIPE_API_KEY_CHECKOUTS);
    
    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: 'price_1RHXeqB1e4Ppxoh0ksoqze0e', // The price ID for Dispute Letter
          quantity: 1,
        },
      ],
      currency: currency.toLowerCase(),
      mode: 'payment',
      allow_promotion_codes: true,
      success_url: `${req.headers.origin}/payment-success?session_id={CHECKOUT_SESSION_ID}&form_data=${encodeURIComponent(JSON.stringify(formData))}`,
      cancel_url: `${req.headers.origin}/form`,
      metadata: {
        app_id: process.env.VITE_PUBLIC_APP_ID,
        user_id: user.id,
        email: user.email,
      }
    }, {
      stripeAccount: 'acct_1RBjPHB1e4Ppxoh0'
    });

    res.status(200).json({ id: session.id, url: session.url });
  } catch (error) {
    console.error("API: Create checkout error:", error);
    Sentry.captureException(error);
    res.status(500).json({ error: error.message || 'Failed to create checkout session' });
  }
}