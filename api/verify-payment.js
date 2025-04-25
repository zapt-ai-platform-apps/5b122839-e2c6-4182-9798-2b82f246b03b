import { authenticateUser } from './_apiUtils.js';
import { letters } from '../drizzle/schema.js';
import { drizzle } from 'drizzle-orm/postgres-js';
import { eq } from 'drizzle-orm';
import postgres from 'postgres';
import Stripe from 'stripe';
import * as Sentry from '@sentry/node';
import fetch from 'node-fetch';

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

async function generateDisputeLetterBackend(letterData) {
  try {
    const prompt = `
Create a professional and assertive dispute letter for a parking ticket with the following details:

Vehicle: ${letterData.vehicleMake} ${letterData.vehicleModel} (Reg: ${letterData.vehicleReg})
Ticket Number: ${letterData.ticketNumber}
Date Issued: ${letterData.ticketDate}
Reason for Ticket: ${letterData.ticketReason}
Country: ${letterData.country || 'United Kingdom'}

Circumstances:
${letterData.circumstances}

The letter should be addressed from:
${letterData.keeperAddress}

And addressed to:
${letterData.companyAddress}

Format the letter professionally with proper headings, date, addresses, and a formal closing.
Include strong legal arguments tailored to the specific circumstances.
Keep the tone professional yet assertive.
Be precise and reference relevant laws and regulations from ${letterData.country || 'United Kingdom'}.
Include a clear request to cancel the ticket based on the circumstances.

In addition to the letter, provide a brief bullet-point summary of the key arguments being made.
`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: 'You are a legal assistant specializing in parking ticket disputes.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    // Split content into letter and summary
    const summaryIndex = content.lastIndexOf('Key Arguments:');
    
    let letter, summary;
    if (summaryIndex !== -1) {
      letter = content.substring(0, summaryIndex).trim();
      summary = content.substring(summaryIndex).trim();
    } else {
      letter = content;
      summary = 'Summary not available';
    }

    return { letter, summary };
  } catch (error) {
    console.error('Error generating dispute letter:', error);
    Sentry.captureException(error);
    throw new Error('Failed to generate dispute letter');
  }
}

export default async function handler(req, res) {
  try {
    console.log('API: Verify payment request received');
    
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    // Authenticate the user
    const user = await authenticateUser(req);
    console.log(`API: User authenticated: ${user.id}`);

    const { sessionId, letterId } = req.body;
    if (!sessionId || !letterId) {
      return res.status(400).json({ error: 'Session ID and Letter ID are required' });
    }

    // Verify payment with Stripe
    const stripe = new Stripe(process.env.STRIPE_API_KEY_CHECKOUTS);
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      stripeAccount: 'acct_1RBjPHB1e4Ppxoh0'
    });

    if (session.payment_status !== 'paid') {
      return res.status(400).json({ error: 'Payment not completed' });
    }

    // Verify the letter ID in metadata matches the requested letter ID
    if (session.metadata.letter_id !== letterId.toString()) {
      return res.status(400).json({ error: 'Letter ID mismatch' });
    }

    // Get letter data from database
    const client = postgres(process.env.COCKROACH_DB_URL);
    const db = drizzle(client);

    const letterData = await db.select()
      .from(letters)
      .where(eq(letters.id, letterId))
      .limit(1);

    if (!letterData || letterData.length === 0) {
      return res.status(404).json({ error: 'Letter not found' });
    }

    const letter = letterData[0];

    // Verify that the letter belongs to the authenticated user
    if (letter.userId !== user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Generate letter if it doesn't exist yet
    let generatedLetter = letter.generatedLetter;
    let keySummary = letter.keySummary;

    if (!generatedLetter || !keySummary) {
      const letterData = {
        vehicleMake: letter.vehicleMake,
        vehicleModel: letter.vehicleModel,
        vehicleReg: letter.vehicleReg,
        ticketNumber: letter.ticketNumber,
        ticketDate: letter.ticketDate,
        ticketReason: letter.ticketReason,
        circumstances: letter.circumstances,
        keeperAddress: letter.keeperAddress,
        companyAddress: letter.companyAddress,
        country: letter.country
      };

      const generatedContent = await generateDisputeLetterBackend(letterData);
      generatedLetter = generatedContent.letter;
      keySummary = generatedContent.summary;
    }

    // Update letter with payment status and generated content
    await db.update(letters)
      .set({
        paymentStatus: 'paid',
        generatedLetter: generatedLetter,
        keySummary: keySummary
      })
      .where(eq(letters.id, letterId));

    console.log(`API: Payment verified and letter updated for ID: ${letterId}`);

    res.status(200).json({ 
      success: true, 
      letterId: letterId
    });
  } catch (error) {
    console.error("API: Verify payment error:", error);
    Sentry.captureException(error);
    res.status(500).json({ error: error.message || 'Failed to verify payment' });
  }
}