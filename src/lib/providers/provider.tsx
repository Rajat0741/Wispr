"use client";

import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";
import { ChatProvider } from "./chat-provider";

export function Provider({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" enableSystem disableTransitionOnChange>
      <ChatProvider>{children}</ChatProvider>
    </ThemeProvider>
  );
}
