"use server";

import { headers } from "next/headers";
import { updateProfileSchema } from "@/features/profile/schema";
import { auth } from "@/lib/auth";
import { authActionClient } from "@/lib/safe-action";
import { AppError } from "@/utils/app-error";

export const updateProfile = authActionClient
  .inputSchema(updateProfileSchema)
  .action(async ({ parsedInput }) => {
    try {
      await auth.api.updateUser({
        body: parsedInput,
        headers: await headers(),
      });

      return parsedInput;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Could not update your profile.";
      throw new AppError(message, 400);
    }
  });
