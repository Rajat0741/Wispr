import { Skeleton } from "@/components/ui/skeleton";

export function ChatMessagesSkeleton() {
  return (
    <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6">
      {/* Incoming Message Group */}
      <div className="flex items-end gap-3 max-w-[70%]">
        <Skeleton className="size-7 rounded-full shrink-0" />
        <div className="space-y-2">
          <Skeleton className="h-3 w-16 rounded-md" />
          <div className="space-y-1.5">
            <Skeleton className="h-10 w-64 rounded-2xl rounded-bl-sm" />
            <Skeleton className="h-8 w-40 rounded-2xl rounded-bl-sm" />
          </div>
          <Skeleton className="h-3 w-8 rounded-md" />
        </div>
      </div>

      {/* Outgoing Message Group */}
      <div className="flex items-end justify-end gap-3 max-w-[70%] ml-auto">
        <div className="space-y-2 flex flex-col items-end">
          <div className="space-y-1.5 flex flex-col items-end">
            <Skeleton className="h-14 w-80 rounded-2xl rounded-br-sm" />
            <Skeleton className="h-10 w-48 rounded-2xl rounded-br-sm" />
          </div>
          <Skeleton className="h-3 w-8 rounded-md" />
        </div>
      </div>

      {/* Incoming Message Group */}
      <div className="flex items-end gap-3 max-w-[70%]">
        <Skeleton className="size-7 rounded-full shrink-0" />
        <div className="space-y-2">
          <Skeleton className="h-3 w-20 rounded-md" />
          <div className="space-y-1.5">
            <Skeleton className="h-12 w-56 rounded-2xl rounded-bl-sm" />
          </div>
          <Skeleton className="h-3 w-8 rounded-md" />
        </div>
      </div>

      {/* Outgoing Message Group */}
      <div className="flex items-end justify-end gap-3 max-w-[70%] ml-auto">
        <div className="space-y-2 flex flex-col items-end">
          <div className="space-y-1.5 flex flex-col items-end">
            <Skeleton className="h-10 w-36 rounded-2xl rounded-br-sm" />
          </div>
          <Skeleton className="h-3 w-8 rounded-md" />
        </div>
      </div>
    </div>
  );
}
