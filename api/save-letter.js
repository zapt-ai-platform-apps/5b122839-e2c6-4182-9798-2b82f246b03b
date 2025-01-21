import { authenticateUser } from "./_apiUtils.js";
import { letters } from '../drizzle/schema.js';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

export default async function handler(req, res) {
  try {
    const user = await authenticateUser(req);
    const dbBody = JSON.parse(req.body);

    const client = postgres(process.env.COCKROACH_DB_URL);
    const db = drizzle(client);

    const newLetter = await db.insert(letters).values({
      userId: user.id,
      vehicleMake: dbBody.vehicleMake,
      vehicleModel: dbBody.vehicleModel,
      ticketNumber: dbBody.ticketNumber,
      ticketDate: dbBody.ticketDate,
      ticketReason: dbBody.ticketReason,
      circumstances: dbBody.circumstances,
      generatedLetter: dbBody.letter,
      keySummary: dbBody.summary
    }).returning({ id: letters.id });

    res.status(200).json({ letterId: newLetter[0].id });
  } catch (error) {
    console.error('Save letter error:', error);
    res.status(500).json({ error: 'Failed to save letter' });
  }
}