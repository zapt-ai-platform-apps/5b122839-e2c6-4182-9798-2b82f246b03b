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
    const user = await authenticateUser(req);
    const dbBody = req.body;

    const client = postgres(process.env.COCKROACH_DB_URL);
    const db = drizzle(client);

    const newLetter = await db.insert(letters).values({
      userId: user.id,
      vehicleMake: dbBody.vehicleMake,
      vehicleModel: dbBody.vehicleModel,
      vehicleReg: dbBody.vehicleReg,
      ticketNumber: dbBody.ticketNumber,
      ticketDate: dbBody.ticketDate,
      ticketReason: dbBody.ticketReason,
      keeperAddress: dbBody.keeperAddress,
      companyAddress: dbBody.companyAddress,
      circumstances: dbBody.circumstances,
      generatedLetter: dbBody.letter,
      keySummary: dbBody.summary
    }).returning({ id: letters.id });

    res.status(200).json({ letterId: newLetter[0].id });
  } catch (error) {
    console.error('Save letter error:', error);
    Sentry.captureException(error);
    res.status(500).json({ error: 'Failed to save letter' });
  }
}