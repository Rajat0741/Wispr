import { createSafeActionClient } from "next-safe-action";
import { getUserSession } from "@/lib/getUser";
import { AppError } from "@/utils/app-error";
import { checkUserMembershipInRoom } from "./db/queries";

export const actionClient = createSafeActionClient({
  handleServerError: (error) => {
    if (error instanceof AppError) {
      return error.message;
    }
    return "An unexpected error occurred. Please try again.";
  }
});

export const authActionClient = actionClient.use(async ({ next }) => {
  const session = await getUserSession();
  return next({ ctx: { user: session.user, session: session.session } });
});

export const roomActionClient = authActionClient
  .use(async ({ next, ctx, clientInput }) => {
    const { roomId } = clientInput as { roomId?: string };
    if (!roomId) {
      throw new AppError("Room ID is required", 400);
    }
    const roomMember = await checkUserMembershipInRoom(roomId, ctx.user.id);

    if (!roomMember) {
      throw new AppError("Conversation not found", 404);
    }

    return next({ ctx: { ...ctx, roomData: { roomId, roomMember } } });
  });
