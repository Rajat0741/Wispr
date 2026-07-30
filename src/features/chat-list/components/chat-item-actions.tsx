"use client";

import { useQueryClient } from "@tanstack/react-query";
import {
  MessageCircleIcon,
  MoreHorizontalIcon,
  PinIcon,
  Trash2Icon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CHAT_ROOMS_KEY } from "@/features/chat-list/queries/get-chat-rooms";
import { togglePinChat } from "@/features/chat-list/queries/toggle-pin-chat";
import { DeleteChatDialog } from "@/features/common/components/delete-chat-dialog";
import { cn } from "@/lib/utils";

export function ChatItemActions({
  roomId,
  roomName,
  isGroup,
  isPinned,
  isActive,
  className,
  onOpenChange,
}: {
  roomId: string;
  roomName: string;
  isGroup: boolean;
  isPinned: boolean;
  isActive: boolean;
  className?: string;
  onOpenChange?: (open: boolean) => void;
}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const actionLabel = isGroup ? "Leave group" : "Delete";

  const { execute: executePin, isExecuting: isPinning } = useAction(
    togglePinChat,
    {
      onSuccess: () =>
        queryClient.invalidateQueries({ queryKey: CHAT_ROOMS_KEY }),
    },
  );

  return (
    <>
      <DropdownMenu onOpenChange={onOpenChange}>
        <DropdownMenuTrigger
          render={
            <Button variant="ghost" size="icon-xs" className={cn(className)} />
          }
          aria-label={`Actions for ${roomName}`}
          onClick={(event) => event.stopPropagation()}
          onPointerDown={(event) => event.stopPropagation()}
        >
          <MoreHorizontalIcon />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" side="right">
          <DropdownMenuItem onClick={() => router.push(`/chat/${roomId}`)}>
            <MessageCircleIcon />
            Open chat
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={isPinning}
            onClick={() => executePin({ roomId, isPinned: !isPinned })}
          >
            <PinIcon />
            {isPinned ? "Unpin" : "Pin"}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            onClick={() => setDeleteOpen(true)}
          >
            <Trash2Icon />
            {actionLabel}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteChatDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        roomId={roomId}
        isGroup={isGroup}
        onSuccess={() => {
          if (isActive) router.push("/chat");
        }}
      />
    </>
  );
}
