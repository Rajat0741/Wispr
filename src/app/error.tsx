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

type AppErrorProps = {
  error: Error & { digest?: string };
};

export default function GlobalError({ error }: AppErrorProps) {
  return (
    <main className="flex min-h-dvh items-center justify-center p-6">
      <Empty className="max-w-xl border border-dashed border-border bg-card/30">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <AlertCircleIcon />
          </EmptyMedia>
          <EmptyTitle className="text-2xl">Something went wrong</EmptyTitle>
          <EmptyDescription>
            An unexpected error occurred. Please try again later or return to
            home.
          </EmptyDescription>
        </EmptyHeader>

        {error.digest && (
          <p className="text-xs text-muted-foreground font-mono">
            Reference: {error.digest}
          </p>
        )}

        <EmptyContent>
          <Link
            href="/"
            className={cn(
              buttonVariants({
                variant: "outline",
                size: "default",
              }),
            )}
          >
            <ArrowLeftIcon className="size-4" />
            Back to Home
          </Link>
        </EmptyContent>
      </Empty>
    </main>
  );
}
