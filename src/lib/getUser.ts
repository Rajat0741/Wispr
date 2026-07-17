import { headers } from "next/headers";
import { cache } from "react";
import { auth } from "@/lib/auth";
import { AppError } from "@/utils/app-error";

type Session = typeof auth.$Infer.Session;

/**
* Pass req.headers when calling getSession in route handlers.
*/
export const getUserSession = cache(async (headersObj ? : Headers): Promise < Session > => {
	const headersToUse = headersObj ?? await headers();
	const userSession = await auth.api.getSession({ headers: headersToUse });
    if (!userSession || !userSession.user) {
      throw new AppError("Unauthorized", 401);
    }
    return userSession;
});
