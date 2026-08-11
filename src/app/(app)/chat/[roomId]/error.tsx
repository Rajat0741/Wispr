"use client";

import { AlertCircleIcon, ArrowLeftIcon } from "lucide-react";
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

type ChatErrorProps = {
  error: Error & { digest?: string };
};

export default function ChatError({ error }: ChatErrorProps) {
  return (
    <div className="flex h-full w-full min-h-0 items-center justify-center bg-background p-6">
      <Empty className="max-w-md border border-dashed border-border bg-card/30">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <AlertCircleIcon />
          </EmptyMedia>
          <EmptyTitle className="text-xl">Failed to Load Chat</EmptyTitle>
          <EmptyDescription>
            An unexpected error occurred while loading this conversation. Please
            try again later.
          </EmptyDescription>
        </EmptyHeader>

        {error.digest && (
          <p className="text-xs text-muted-foreground font-mono">
            Reference: {error.digest}
          </p>
        )}

        <EmptyContent>
          <Link
            href="/chat"
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            <ArrowLeftIcon className="size-4" />
            Back to Chats
          </Link>
        </EmptyContent>
      </Empty>
    </div>
  );
}
