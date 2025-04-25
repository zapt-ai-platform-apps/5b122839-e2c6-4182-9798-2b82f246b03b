import { authenticateUser } from "./_apiUtils.js";
import { letters } from '../drizzle/schema.js';
import { drizzle } from 'drizzle-orm/postgres-js';
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
    console.log('API: Save pending letter request received');
    const user = await authenticateUser(req);
    const formData = req.body;

    if (!formData) {
      return res.status(400).json({ error: 'Form data is required' });
    }

    const client = postgres(process.env.COCKROACH_DB_URL);
    const db = drizzle(client);

    // Save letter with pending status
    const newLetter = await db.insert(letters).values({
      userId: user.id,
      vehicleMake: formData.vehicleMake,
      vehicleModel: formData.vehicleModel,
      vehicleReg: formData.vehicleReg,
      ticketNumber: formData.ticketNumber,
      ticketDate: formData.ticketDate,
      ticketReason: formData.ticketReason,
      keeperAddress: formData.keeperAddress,
      companyAddress: formData.companyAddress,
      circumstances: formData.circumstances,
      country: formData.country,
      paymentStatus: 'pending',
      generatedLetter: null, // Will be generated after payment
      keySummary: null // Will be generated after payment
    }).returning({ id: letters.id });

    console.log(`API: Letter saved with pending status, ID: ${newLetter[0].id}`);
    
    res.status(200).json({ letterId: newLetter[0].id });
  } catch (error) {
    console.error('Save pending letter error:', error);
    Sentry.captureException(error);
    res.status(500).json({ error: 'Failed to save letter data' });
  }
}