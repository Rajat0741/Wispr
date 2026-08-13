import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface ChatHeaderSkeletonProps {
  onBack?: () => void;
}

export function ChatHeaderSkeleton({ onBack }: ChatHeaderSkeletonProps) {
  return (
    <header className="flex items-center border-b px-4 py-2">
      {onBack && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="-ml-1.5 mr-1 shrink-0"
          aria-label="Back to chats"
        >
          <ArrowLeft className="size-5" />
        </Button>
      )}
      <div className="flex flex-1 items-center gap-3 min-w-0 p-1.5 -mx-1.5">
        <Skeleton className="size-9 rounded-full shrink-0" />
        <div className="space-y-1.5 min-w-0">
          <Skeleton className="h-4 w-32 rounded-md" />
          <Skeleton className="h-3 w-48 rounded-md" />
        </div>
      </div>
      <Skeleton className="size-8 rounded-md ml-auto shrink-0" />
    </header>
  );
}
