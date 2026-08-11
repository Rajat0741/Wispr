import { ArrowLeftIcon, SearchXIcon } from "lucide-react";
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

export default function NotFound() {
  return (
    <main className="flex min-h-dvh items-center justify-center p-6">
      <Empty className="max-w-xl border border-dashed border-border bg-card/30">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <SearchXIcon />
          </EmptyMedia>
          <EmptyTitle className="text-2xl">Page Not Found</EmptyTitle>
          <EmptyDescription>
            The conversation or page you are looking for doesn&apos;t exist, was
            deleted, or you don&apos;t have permission to access it.
          </EmptyDescription>
        </EmptyHeader>

        <EmptyContent>
          <Link
            href="/"
            className={cn(
              buttonVariants({ variant: "outline", size: "default" }),
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
