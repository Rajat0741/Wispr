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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteChat } from "@/features/chat-list/actions/delete-chat";
import { CHAT_ROOMS_KEY } from "@/features/chat-list/queries/get-chat-rooms";
import { togglePinChat } from "@/features/chat-list/queries/toggle-pin-chat";
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
  const { execute: executeDelete, isExecuting: isDeleting } = useAction(
    deleteChat,
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: CHAT_ROOMS_KEY });
        setDeleteOpen(false);
        if (isActive) router.push("/chat");
      },
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
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isGroup ? "Leave group?" : "Delete conversation?"}
            </DialogTitle>
            <DialogDescription>
              {isGroup
                ? "You will leave this group and it will be removed from your chat list."
                : "This will permanently delete this direct message for both participants."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={isDeleting}
              onClick={() => executeDelete({ roomId })}
            >
              {isDeleting ? "Processing..." : actionLabel}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
