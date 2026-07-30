"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useAction } from "next-safe-action/hooks";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CHAT_ROOMS_KEY } from "@/features/chat-list/queries/get-chat-rooms";
import { deleteChat } from "@/features/common/actions/delete-chat";

type DeleteChatDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  roomId: string;
  isGroup: boolean;
  onSuccess?: () => void;
};

export function DeleteChatDialog({
  open,
  onOpenChange,
  roomId,
  isGroup,
  onSuccess,
}: DeleteChatDialogProps) {
  const queryClient = useQueryClient();
  const actionLabel = isGroup ? "Leave group" : "Delete";
  const { execute: executeDelete, isExecuting: isDeleting } = useAction(
    deleteChat,
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: CHAT_ROOMS_KEY });
        onOpenChange(false);
        onSuccess?.();
      },
    },
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isGroup ? "Leave group?" : "Delete conversation?"}
          </DialogTitle>
          <DialogDescription>
            {isGroup
              ? `Leave this group?`
              : "This will permanently delete messages for both participants."}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
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
  );
}
