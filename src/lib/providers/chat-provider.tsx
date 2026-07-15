"use client";

import { ChatClient, LogLevel } from "@ably/chat";
import { ChatClientProvider } from "@ably/chat/react";
import * as Ably from "ably";
import { AblyProvider } from "ably/react";
import { type ReactNode, useEffect, useState } from "react";

export function ChatProvider({ children }: { children: ReactNode }) {
  const [client, setClient] = useState<{
    realtime: Ably.Realtime;
    chat: ChatClient;
  } | null>(null);

  useEffect(() => {
    const realtime = new Ably.Realtime({
      authUrl: "/api/ably-token",
      authMethod: "POST",
    });
    const chat = new ChatClient(realtime, {
      logLevel: LogLevel.Error,
    });

    setClient({ realtime, chat });

    return () => {
      realtime.close();
    };
  }, []);

  if (!client) return null;

  return (
    <AblyProvider client={client.realtime}>
      <ChatClientProvider client={client.chat}>{children}</ChatClientProvider>
    </AblyProvider>
  );
}
