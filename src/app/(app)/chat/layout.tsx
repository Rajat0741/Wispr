import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ChatList } from "@/features/chat-list/components/chat-list";

export default function Page({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <ResizablePanelGroup orientation="horizontal">
        <ResizablePanel minSize="20%" maxSize="40%" defaultSize="25%">
          <ChatList />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel>{children}</ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
