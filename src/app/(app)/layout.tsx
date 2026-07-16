"use client";

import type { ReactNode } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { ChatProvider } from "@/lib/providers/chat-provider";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <ChatProvider>
      <SidebarProvider open={false}>
        <AppSidebar />
        <SidebarInset>
          <main className="flex min-h-0 flex-1 flex-col">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </ChatProvider>
  );
}
