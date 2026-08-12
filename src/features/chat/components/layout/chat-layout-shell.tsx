"use client";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ChatList } from "@/features/chat-list/components/chat-list";
import { useIsMobile } from "@/hooks/use-mobile";

export function ChatLayoutShell({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="flex w-full h-svh overflow-hidden">{children}</div>
    );
  }

  return (
    <div className="flex w-full h-svh overflow-hidden">
      <ResizablePanelGroup orientation="horizontal">
        <ResizablePanel minSize="20%" maxSize="40%" defaultSize="25%" className="border-r border-border">
          <ChatList />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel>{children}</ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
