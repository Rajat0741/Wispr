import { z } from "zod";

export const usernameSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(3, "Username must be at least 3 characters.")
  .max(30, "Use 3-30 letters, numbers, underscores, or dots.")
  .regex(
    /^[a-zA-Z0-9_]+$/,
    "Only letters, numbers and underscores are allowed.",
  );

export const updateUsernameSchema = z.object({
  username: usernameSchema,
});
