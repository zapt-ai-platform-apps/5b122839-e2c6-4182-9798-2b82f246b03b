import { authenticateUser } from "./_apiUtils.js";
import { letters } from '../drizzle/schema.js';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { eq } from 'drizzle-orm';

export default async function handler(req, res) {
  try {
    const user = await authenticateUser(req);
    const letterId = req.query.id;

    const client = postgres(process.env.COCKROACH_DB_URL);
    const db = drizzle(client);

    const result = await db.select()
      .from(letters)
      .where(eq(letters.id, letterId))
      .limit(1);

    if (result.length === 0 || result[0].userId !== user.id) {
      return res.status(404).json({ error: 'Letter not found' });
    }

    res.status(200).json({
      letter: result[0].generatedLetter,
      summary: result[0].keySummary,
      details: {
        vehicleMake: result[0].vehicleMake,
        vehicleModel: result[0].vehicleModel,
        ticketNumber: result[0].ticketNumber,
        ticketDate: result[0].ticketDate,
        ticketReason: result[0].ticketReason
      }
    });
  } catch (error) {
    console.error('Get letter error:', error);
    res.status(500).json({ error: 'Failed to retrieve letter' });
  }
}