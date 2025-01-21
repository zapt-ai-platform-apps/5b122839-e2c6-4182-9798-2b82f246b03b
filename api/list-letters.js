import { authenticateUser } from "./_apiUtils.js";
import { letters } from '../drizzle/schema.js';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { eq } from 'drizzle-orm';
import * as Sentry from '@sentry/node';

export default async function handler(req, res) {
  try {
    const user = await authenticateUser(req);

    const client = postgres(process.env.COCKROACH_DB_URL);
    const db = drizzle(client);

    const result = await db.select()
      .from(letters)
      .where(eq(letters.userId, user.id))
      .orderBy(letters.createdAt);

    res.status(200).json(result);
  } catch (error) {
    console.error('List letters error:', error);
    Sentry.captureException(error);
    res.status(500).json({ error: 'Failed to retrieve letters' });
  }
}