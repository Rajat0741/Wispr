"use server";

import { headers } from "next/headers";
import { updateUsernameSchema } from "@/features/profile/schema";
import { auth } from "@/lib/auth";
import { authActionClient } from "@/lib/safe-action";
import { AppError } from "@/utils/app-error";

export const updateUsername = authActionClient
  .inputSchema(updateUsernameSchema)
  .action(async ({ parsedInput: { username } }) => {
    try {
      await auth.api.updateUser({
        body: { username },
        headers: await headers(),
      });

      return { username };
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Could not update your username.";
      throw new AppError(message, 400);
    }
  });
