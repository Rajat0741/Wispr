"use client";

import type { ReactNode } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { ChatProvider } from "@/lib/providers/chat-provider";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <ChatProvider>
      <SidebarProvider
        style={{ "--sidebar-width": "350px" } as React.CSSProperties}
      >
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-14 shrink-0 items-center border-b border-sidebar-border px-4">
            <SidebarTrigger className="-ml-1" />
          </header>
          <main className="flex min-h-0 flex-1 flex-col">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </ChatProvider>
  );
}
