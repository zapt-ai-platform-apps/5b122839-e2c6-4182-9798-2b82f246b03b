import { authenticateUser } from "./_apiUtils.js";
import { letters } from '../drizzle/schema.js';
import { drizzle } from 'drizzle-orm/postgres-js';
import { eq } from 'drizzle-orm';
import postgres from 'postgres';
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
    const user = await authenticateUser(req);
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ error: 'Letter ID is required' });
    }

    const client = postgres(process.env.COCKROACH_DB_URL);
    const db = drizzle(client);

    const letterData = await db.select()
      .from(letters)
      .where(eq(letters.id, id))
      .limit(1);

    if (!letterData || letterData.length === 0) {
      return res.status(404).json({ error: 'Letter not found' });
    }

    const letter = letterData[0];

    // Verify that the letter belongs to the authenticated user
    if (letter.userId !== user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Check if payment status is 'paid'
    if (letter.paymentStatus !== 'paid') {
      return res.status(402).json({ 
        error: 'Payment required',
        letterId: letter.id,
        isPaid: false,
        basicDetails: {
          vehicleMake: letter.vehicleMake,
          vehicleModel: letter.vehicleModel,
          ticketNumber: letter.ticketNumber,
          ticketDate: letter.ticketDate,
          createdAt: letter.createdAt
        }
      });
    }

    res.status(200).json({
      id: letter.id,
      vehicleMake: letter.vehicleMake,
      vehicleModel: letter.vehicleModel,
      vehicleReg: letter.vehicleReg,
      ticketNumber: letter.ticketNumber,
      ticketDate: letter.ticketDate,
      ticketReason: letter.ticketReason,
      circumstances: letter.circumstances,
      keeperAddress: letter.keeperAddress,
      companyAddress: letter.companyAddress,
      country: letter.country,
      generatedLetter: letter.generatedLetter,
      keySummary: letter.keySummary,
      createdAt: letter.createdAt,
      isPaid: true
    });
  } catch (error) {
    console.error('Get letter error:', error);
    Sentry.captureException(error);
    res.status(500).json({ error: 'Failed to retrieve letter' });
  }
}