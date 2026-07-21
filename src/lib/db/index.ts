import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from "./schema";

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is not defined in .env file");
  throw new Error("DATABASE_URL is not defined");
}

// Disable prefetch as it is not supported for "Transaction" pool mode
const client = postgres(process.env.DATABASE_URL, { prepare: false })
export const db = drizzle({ client, schema });

