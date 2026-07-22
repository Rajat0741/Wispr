import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({ path: ".env" });

if (!process.env.DIRECT_DB_URL) {
  console.error("DIRECT_DB_URL is not defined in .env file");
  throw new Error("DIRECT_DB_URL is not defined");
}

export default defineConfig({
  schema: "./src/lib/db/schema/index.ts",
  out: "./src/lib/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DIRECT_DB_URL,
  },
});
