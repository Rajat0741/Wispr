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
import { useConfirm } from "@/lib/providers/confirm-dialog-provider";
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
  const confirm = useConfirm();
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
    if (isActive) router.push("/chat");
  };

  const { executeAsync: executeDeleteAsync } = useAction(deleteChat, {
    onSuccess: onActionSuccess,
    onError: ({ error }) =>
      toast.add({ title: "Error", description: error.serverError }),
  });

  const { executeAsync: executeLeaveAsync } = useAction(leaveGroup, {
    onSuccess: onActionSuccess,
    onError: ({ error }) => {
      toast.add({ title: "Error", description: error.serverError });
    },
  });

  const handleLeaveOrDelete = () =>
    confirm({
      title: isGroup ? "Leave group?" : "Delete conversation?",
      description: isGroup
        ? "Leave this group?"
        : "This will permanently delete messages for both participants.",
      confirmLabel: actionLabel,
      onConfirm: async () => {
        await (isGroup
          ? executeLeaveAsync({ roomId })
          : executeDeleteAsync({ roomId }));
      },
    });

  const stopBubbling = (event: React.SyntheticEvent) => event.stopPropagation();

  return (
    <DropdownMenu onOpenChange={onOpenChange}>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon-xs"
            className={cn(className)}
            onClick={stopBubbling}
            onKeyDown={stopBubbling}
            onTouchStart={stopBubbling}
            onTouchEnd={stopBubbling}
          />
        }
        aria-label={`Actions for ${roomName}`}
      >
        <MoreHorizontalIcon />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        side="right"
        onClick={stopBubbling}
        onKeyDown={stopBubbling}
      >
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
        <DropdownMenuItem variant="destructive" onClick={handleLeaveOrDelete}>
          <Trash2Icon />
          {actionLabel}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
