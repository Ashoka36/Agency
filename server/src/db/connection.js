import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema.js';

// For development, you can use a local PostgreSQL connection
// For production, use Neon or another cloud PostgreSQL service
const connectionString = process.env.DATABASE_URL || 'postgresql://localhost:5432/recruitment_db';

let db;

if (process.env.NODE_ENV === 'production' || process.env.DATABASE_URL?.includes('neon')) {
  // Use Neon for production or when DATABASE_URL contains neon
  const sql = neon(connectionString);
  db = drizzle(sql, { schema });
} else {
  // For local development, you might want to use node-postgres
  // This is a placeholder - you'd need to install and configure pg
  console.log('Using local database connection');
  // For now, we'll use a mock database for development
  db = null;
}

export { db, schema };

