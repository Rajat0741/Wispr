"use server";

import { z } from "zod";
import {
  createGroupRecord,
  createRoom,
  createRoomMembers,
  deleteRoom,
} from "@/lib/db/queries";
import { authActionClient } from "@/lib/safe-action";
import { AppError } from "@/utils/app-error";

const createGroupSchema = z.object({
  name: z.string().trim().min(1, "Group name is required.").max(100),
  memberIds: z
    .array(z.string().trim().min(1))
    .min(1, "At least one member must be selected."),
});

export const createGroup = authActionClient
  .inputSchema(createGroupSchema)
  .action(async ({ parsedInput: { name, memberIds }, ctx: { user } }) => {
    // Filter out duplicate user IDs and creator ID
    const uniqueMemberIds = Array.from(
      new Set(memberIds.filter((id) => id !== user.id)),
    );

    if (uniqueMemberIds.length === 0) {
      throw new AppError("Please select at least one member for the group.", 400);
    }

    // 1. Create room
    const room = await createRoom({
      roomType: "group",
    });

    if (!room) {
      throw new AppError("Failed to create group conversation.", 500);
    }

    try {
      // 2. Create group record
      await createGroupRecord({
        roomId: room.id,
        name,
        createdBy: user.id,
      });

      // 3. Create room members (Creator as admin, others as member)
      const membersToInsert = [
        {
          roomId: room.id,
          userId: user.id,
          role: "admin" as const,
        },
        ...uniqueMemberIds.map((id) => ({
          roomId: room.id,
          userId: id,
          role: "member" as const,
        })),
      ];

      await createRoomMembers(membersToInsert);

      return { roomId: room.id };
    } catch (err) {
      await deleteRoom(room.id);
      console.log("Error creating group:", err);
      throw new AppError("Could not complete group creation.", 500);
    }
  });
