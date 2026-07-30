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
import { toast } from "@/components/ui/toast";
import { CHAT_ROOMS_KEY } from "@/features/chat-list/queries/get-chat-rooms";
import { togglePinChat } from "@/features/chat-list/queries/toggle-pin-chat";
import { deleteChat } from "@/features/common/actions/delete-chat";
import { leaveGroup } from "@/features/common/actions/leave-group";
import { ConfirmDialog } from "@/features/common/components/confirm-dialog";
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
  const [confirmOpen, setConfirmOpen] = useState(false);
  const actionLabel = isGroup ? "Leave group" : "Delete";

  const { execute: executePin, isExecuting: isPinning } = useAction(
    togglePinChat,
    {
      onSuccess: () =>
        queryClient.invalidateQueries({ queryKey: CHAT_ROOMS_KEY }),
    },
  );

  const onActionSuccess = async () => {
    await queryClient.invalidateQueries({ queryKey: CHAT_ROOMS_KEY });
    setConfirmOpen(false);
    if (isActive) router.push("/chat");
  };

  const { execute: executeDelete, isExecuting: isDeleting } = useAction(
    deleteChat,
    {
      onSuccess: onActionSuccess,
      onError: ({ error }) => {
        setConfirmOpen(false);
        if (error?.thrownError) {
          toast.add({ title: "Error", description: error.serverError });
        } else {
          toast.add({ title: "Error", description: "An unknown error occurred." });
        }
      },
    },
  );

  const { execute: executeLeave, isExecuting: isLeaving } = useAction(
    leaveGroup,
    {
      onSuccess: onActionSuccess,
      onError: ({ error }) => {
        setConfirmOpen(false);
        toast.add({ title: "Error", description: error.serverError });
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
            onClick={() => setConfirmOpen(true)}
          >
            <Trash2Icon />
            {actionLabel}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={isGroup ? "Leave group?" : "Delete conversation?"}
        description={
          isGroup
            ? "Leave this group?"
            : "This will permanently delete messages for both participants."
        }
        confirmLabel={actionLabel}
        isLoading={isDeleting || isLeaving}
        onConfirm={() =>
          isGroup ? executeLeave({ roomId }) : executeDelete({ roomId })
        }
      />
    </>
  );
}
