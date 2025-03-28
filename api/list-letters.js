import { authenticateUser } from "./_apiUtils.js";
import { letters } from '../drizzle/schema.js';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { eq, desc } from 'drizzle-orm';
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
    
    // Authenticate user
    const user = await authenticateUser(req);
    console.log(`API: User authenticated: ${user.id}`);
    
    // Connect to database
    if (!process.env.COCKROACH_DB_URL) {
      throw new Error('Database connection string not configured');
    }
    
    const client = postgres(process.env.COCKROACH_DB_URL);
    const db = drizzle(client);
    console.log('API: Database connection established');
    
    // Query letters
    const result = await db.select()
      .from(letters)
      .where(eq(letters.userId, user.id))
      .orderBy(desc(letters.createdAt)); // Most recent first
    
    console.log(`API: Found ${result.length} letters for user`);
    
    // Return results
    res.status(200).json(result);
    
  } catch (error) {
    console.error('API Error - List letters:', error);
    Sentry.captureException(error);
    
    // Determine appropriate error response
    if (error.message === 'Missing Authorization header' || error.message === 'Invalid token') {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    if (error.message.includes('Database connection')) {
      return res.status(503).json({ error: 'Database service unavailable' });
    }
    
    // Generic error
    res.status(500).json({ 
      error: 'Failed to retrieve letters',
      details: error.message
    });
  } finally {
    // Close connection if needed
    // client.end() - Postgres.js handles this automatically
  }
}