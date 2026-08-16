import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { AppError } from "@/utils/app-error";
import * as schema from "./schema";

const databaseUrl = process.env.DATABASE_URL;

const postgresOptions = {
  max: 10,
  idle_timeout: 20,
  max_lifetime: 60 * 30,
  connect_timeout: 10,
  prepare: false,
} as const;

if (!databaseUrl) {
  console.log("DATABASE_URL environment variable is not set.");
  throw new AppError("DATABASE_URL environment variable is not set.", 500);
}

const globalForDb = globalThis as unknown as {
  postgresSqlClient: ReturnType<typeof postgres> | undefined;
};

const postgresSqlClient =
  globalForDb.postgresSqlClient ?? postgres(databaseUrl, postgresOptions);

globalForDb.postgresSqlClient = postgresSqlClient;

export const db = drizzle(postgresSqlClient, { schema });

export type TransactionScope =
  | typeof db
  | Parameters<Parameters<typeof db.transaction>[0]>[0];
