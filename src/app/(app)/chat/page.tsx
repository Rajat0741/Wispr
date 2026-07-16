import { MessageCircleIcon } from "lucide-react";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export default function Page() {
  return (
    <Empty className="rounded-none border-0">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <MessageCircleIcon />
        </EmptyMedia>
        <EmptyTitle>Select a chat</EmptyTitle>
        <EmptyDescription>
          Start a conversation to get started.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
