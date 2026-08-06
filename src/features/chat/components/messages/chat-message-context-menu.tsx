"use client";

import { CopyIcon, ReplyIcon, Trash2Icon } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import type { ReactNode } from "react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { toast } from "@/components/ui/toast";
import { deleteMessage } from "@/features/chat/actions/deleteMessage";
import { useChatStore } from "@/features/chat/components/layout/chat-provider";
import type { MessageWithSender } from "@/features/chat/types";
import { authClient } from "@/lib/auth-client";
import { useConfirm } from "@/lib/providers/confirm-dialog-provider";

interface ChatMessageContextMenuProps {
  message: MessageWithSender;
  children: ReactNode;
}

export function ChatMessageContextMenu({
  message,
  children,
}: ChatMessageContextMenuProps) {
  const { data: session } = authClient.useSession();
  const currentUserId = session?.user?.id;

  const setReplyTo = useChatStore((s) => s.setReplyTo);
  const roomId = useChatStore((s) => s.roomId);
  const members = useChatStore((s) => s.members);

  const confirm = useConfirm();

  const isSender = Boolean(currentUserId && message.senderId === currentUserId);
  const currentUserMember = members.find((m) => m.id === currentUserId);
  const isAdmin = currentUserMember?.role === "admin";

  const canDelete = isSender || isAdmin;

  const { executeAsync: executeDeleteAsync } = useAction(deleteMessage, {
    onError: ({ error }) => {
      toast.add({
        title: "Failed to delete message",
        description: error.serverError,
      });
    },
  });

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      toast.add({
        title: "Copied to clipboard",
      });
    } catch {
      toast.add({
        title: "Failed to copy message",
      });
    }
  };

  const handleReply = () => {
    setReplyTo(message);
  };

  const handleDelete = () => {
    confirm({
      title: "Delete message?",
      description:
        "This message will be permanently deleted for all participants.",
      confirmLabel: "Delete",
      onConfirm: async () => {
        await executeDeleteAsync({ roomId, messageId: message.id });
      },
    });
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger>{children}</ContextMenuTrigger>
      <ContextMenuContent className="border border-border">
        <ContextMenuItem onClick={handleCopy}>
          <CopyIcon />
          Copy
        </ContextMenuItem>
        <ContextMenuItem onClick={handleReply}>
          <ReplyIcon />
          Reply
        </ContextMenuItem>
        {canDelete && (
          <>
            <ContextMenuSeparator />
            <ContextMenuItem variant="destructive" onClick={handleDelete}>
              <Trash2Icon />
              Delete
            </ContextMenuItem>
          </>
        )}
      </ContextMenuContent>
    </ContextMenu>
  );
}
