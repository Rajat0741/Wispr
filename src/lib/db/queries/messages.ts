import type z from "zod";
import { db } from "@/lib/db";
import { type insertMessageSchema, messages } from "../schema";

export const createMessage = async (
  messageData: z.infer<typeof insertMessageSchema>,
) => {
  const response = await db.insert(messages).values(messageData).returning();
  return response[0];
};
