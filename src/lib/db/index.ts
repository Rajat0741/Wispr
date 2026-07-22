import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { AppError } from "@/utils/app-error";
import * as schema from "./schema";

declare namespace global {
  let postgresSqlClient: ReturnType<typeof postgres> | undefined;
}

let postgresSqlClient: ReturnType<typeof postgres> | undefined;

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.log("DATABASE_URL environment variable is not set.");
  throw new AppError("DATABASE_URL environment variable is not set.", 500);
}

if (process.env.NODE_ENV !== "production") {
  if (!global.postgresSqlClient) {
    global.postgresSqlClient = postgres(databaseUrl);
  }
  postgresSqlClient = global.postgresSqlClient;
} else {
  postgresSqlClient = postgres(databaseUrl);
}

export const db = drizzle(postgresSqlClient, { schema });
