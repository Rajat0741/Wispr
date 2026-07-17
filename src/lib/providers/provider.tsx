"use client";

import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";
import QueryProvider from "./QueryProvider";

export function Provider({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" enableSystem disableTransitionOnChange>
      <QueryProvider>{children}</QueryProvider>
    </ThemeProvider>
  );
}
