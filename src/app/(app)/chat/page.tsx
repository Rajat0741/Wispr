import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { MessageCircleIcon } from "lucide-react";

export default function Page() {
  return (
    <Empty className="rounded-none border-0">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <MessageCircleIcon />
        </EmptyMedia>
        <EmptyTitle>Select a chat</EmptyTitle>
        <EmptyDescription>
          Choose a conversation from the sidebar to get started.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
