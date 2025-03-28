import { authenticateUser } from "./_apiUtils.js";
import { letters } from '../drizzle/schema.js';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { eq } from 'drizzle-orm';
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
    console.log('API: Get letter request received for ID:', req.query.id);
    
    const user = await authenticateUser(req);
    console.log(`API: User authenticated: ${user.id}`);
    
    const letterId = req.query.id;
    if (!letterId) {
      throw new Error('Letter ID is required');
    }

    // Connect to database
    if (!process.env.COCKROACH_DB_URL) {
      throw new Error('Database connection string not configured');
    }
    
    const client = postgres(process.env.COCKROACH_DB_URL);
    const db = drizzle(client);
    console.log('API: Database connection established');

    const result = await db.select()
      .from(letters)
      .where(eq(letters.id, letterId))
      .limit(1);

    if (result.length === 0) {
      console.log(`API: Letter not found with ID: ${letterId}`);
      return res.status(404).json({ error: 'Letter not found' });
    }
    
    if (result[0].userId !== user.id) {
      console.log(`API: Unauthorized access attempt for letter ID: ${letterId}`);
      return res.status(403).json({ error: 'Not authorized to access this letter' });
    }

    console.log(`API: Successfully retrieved letter ID: ${letterId}`);
    res.status(200).json({
      letter: result[0].generatedLetter,
      summary: result[0].keySummary,
      details: {
        vehicleMake: result[0].vehicleMake,
        vehicleModel: result[0].vehicleModel,
        vehicleReg: result[0].vehicleReg,
        ticketNumber: result[0].ticketNumber,
        ticketDate: result[0].ticketDate,
        ticketReason: result[0].ticketReason,
        keeperAddress: result[0].keeperAddress,
        companyAddress: result[0].companyAddress
      }
    });
  } catch (error) {
    console.error('API Error - Get letter:', error);
    Sentry.captureException(error);
    
    // Determine appropriate error response
    if (error.message === 'Missing Authorization header' || error.message === 'Invalid token') {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    res.status(500).json({ 
      error: 'Failed to retrieve letter',
      details: error.message 
    });
  }
}