import { ChatLayoutShell } from "@/features/chat/components/layout/chat-layout-shell";

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return <ChatLayoutShell>{children}</ChatLayoutShell>;
}
