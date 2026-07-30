"use server";

import { z } from "zod";
import { leaveGroupTransaction } from "@/lib/db/queries";
import { roomActionClient } from "@/lib/safe-action";

const leaveGroupSchema = z.object({
  roomId: z.uuid(),
});

export const leaveGroup = roomActionClient
  .inputSchema(leaveGroupSchema)
  .action(async ({ parsedInput: { roomId }, ctx: { user } }) => {
    await leaveGroupTransaction(roomId, user.id);
  });
