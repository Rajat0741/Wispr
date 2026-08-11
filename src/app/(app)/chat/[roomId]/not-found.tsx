import { ArrowLeftIcon, MessageSquareOffIcon } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { cn } from "@/lib/utils";

export default function ChatNotFound() {
  return (
    <div className="flex h-full w-full min-h-0 items-center justify-center bg-background p-6">
      <Empty className="max-w-md border border-dashed border-border bg-card/30">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <MessageSquareOffIcon />
          </EmptyMedia>
          <EmptyTitle className="text-xl">Conversation Not Found</EmptyTitle>
          <EmptyDescription>
            This conversation doesn&apos;t exist, was deleted, or you don&apos;t
            have permission to view it.
          </EmptyDescription>
        </EmptyHeader>

        <EmptyContent>
          <Link
            href="/chat"
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            <ArrowLeftIcon className="size-4" />
            Back to Conversations
          </Link>
        </EmptyContent>
      </Empty>
    </div>
  );
}
