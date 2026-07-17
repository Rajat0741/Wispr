import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ChatList } from "@/features/chat-list/components/chat-list";
import { NewChat } from "@/features/chat-list/components/newChat";

export default function Page({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <ResizablePanelGroup orientation="horizontal">
        <ResizablePanel minSize="20%" maxSize="40%" defaultSize="25%">
          <div className="relative">
            <ChatList />
            <NewChat />
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel>{children}</ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
