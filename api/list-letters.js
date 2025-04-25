import { authenticateUser } from "./_apiUtils.js";
import { letters } from '../drizzle/schema.js';
import { drizzle } from 'drizzle-orm/postgres-js';
import { eq, desc } from 'drizzle-orm';
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
    console.log('API: List letters request received');
    const user = await authenticateUser(req);

    const client = postgres(process.env.COCKROACH_DB_URL);
    const db = drizzle(client);

    const letterList = await db.select({
      id: letters.id,
      vehicleMake: letters.vehicleMake,
      vehicleModel: letters.vehicleModel,
      vehicleReg: letters.vehicleReg,
      ticketNumber: letters.ticketNumber,
      ticketDate: letters.ticketDate,
      createdAt: letters.createdAt,
      paymentStatus: letters.paymentStatus
    })
    .from(letters)
    .where(eq(letters.userId, user.id))
    .orderBy(desc(letters.createdAt));

    console.log(`API: Retrieved ${letterList.length} letters for user`);
    
    res.status(200).json(letterList);
  } catch (error) {
    console.error('List letters error:', error);
    Sentry.captureException(error);
    res.status(500).json({ error: 'Failed to retrieve letters' });
  }
}