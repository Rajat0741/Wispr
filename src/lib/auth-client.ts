import { usernameClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { sentinelClient } from "@better-auth/infra/client";

export const authClient = createAuthClient({
  plugins: [usernameClient(), sentinelClient()],
});
