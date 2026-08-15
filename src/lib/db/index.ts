import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { AppError } from "@/utils/app-error";
import * as schema from "./schema";

declare namespace global {
  let postgresSqlClient: ReturnType<typeof postgres> | undefined;
}

let postgresSqlClient: ReturnType<typeof postgres> | undefined;

const databaseUrl = process.env.DATABASE_URL;

const postgresOptions = {
  max: 1,
  idle_timeout: 20,
  max_lifetime: 60 * 30,
  connect_timeout: 10,
  prepare: false,
} as const;

if (!databaseUrl) {
  console.log("DATABASE_URL environment variable is not set.");
  throw new AppError("DATABASE_URL environment variable is not set.", 500);
}

if (process.env.NODE_ENV !== "production") {
  if (!global.postgresSqlClient) {
    global.postgresSqlClient = postgres(databaseUrl, postgresOptions);
  }
  postgresSqlClient = global.postgresSqlClient;
} else {
  postgresSqlClient = postgres(databaseUrl, postgresOptions);
}

export const db = drizzle(postgresSqlClient, { schema });

export type TransactionScope =
  typeof db | Parameters<Parameters<typeof db.transaction>[0]>[0];
