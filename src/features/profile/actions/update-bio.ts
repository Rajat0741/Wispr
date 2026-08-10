"use server";

import { headers } from "next/headers";
import { updateBioSchema } from "@/features/profile/schema";
import { auth } from "@/lib/auth";
import { authActionClient } from "@/lib/safe-action";
import { AppError } from "@/utils/app-error";

export const updateBio = authActionClient
  .inputSchema(updateBioSchema)
  .action(async ({ parsedInput: { bio } }) => {
    try {
      await auth.api.updateUser({
        body: { bio },
        headers: await headers(),
      });

      return { bio };
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Could not update your bio.";
      throw new AppError(message, 400);
    }
  });
