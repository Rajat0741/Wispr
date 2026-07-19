import { ChatClient } from "@ably/chat";
import * as Ably from "ably";

if (!process.env.ABLY_API_KEY) {
  throw new Error("ABLY_API_KEY is not defined in the environment variables.");
}

const realtimeClient = new Ably.Realtime({
  key: process.env.ABLY_API_KEY,
  clientId: "server",
});

export const chatServer = new ChatClient(realtimeClient);
