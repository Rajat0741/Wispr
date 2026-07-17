import { createSafeActionClient } from "next-safe-action";
import { getUserSession } from "@/lib/getUser";
import { AppError } from "@/utils/app-error";

export const actionClient = createSafeActionClient({
    handleServerError: (error) => {
        if (error instanceof AppError) {
            return error.message;
        }
        return "An unexpected error occurred. Please try again.";
    }
});

export const authActionClient = actionClient.use(async ({ next }) => {
  const session = await getUserSession(); // throws AppError if unauthorized
  return next({ ctx: { user: session.user, session: session.session } });
});
