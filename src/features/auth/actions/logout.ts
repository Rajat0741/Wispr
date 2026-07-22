"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { authActionClient } from "@/lib/safe-action";

export const logoutAction = authActionClient.action(async () => {
  await auth.api.signOut({ headers: await headers() });
  redirect("/login");
});
