import { Marker, MarkerContent } from "@/components/ui/marker";
import type { MessageWithSender } from "@/features/chat/types";

export function ChatAnnouncement({ message }: { message: MessageWithSender }) {
  return (
    <Marker className="my-1 justify-center">
      <MarkerContent className="rounded-full bg-muted px-2 py-1">
        {message.content}
      </MarkerContent>
    </Marker>
  );
}
