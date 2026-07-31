"use client";

import { useQueryClient } from "@tanstack/react-query";
import {
  InfoIcon,
  LogOutIcon,
  MoreHorizontalIcon,
  UserPlusIcon,
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
import { useRoomContext } from "@/features/chat/context/room-context";
import { leaveGroup } from "@/features/common/actions/leave-group";
import { useConfirm } from "@/lib/providers/confirm-dialog-provider";
import { AddGroupMemberDialog } from "./add-group-member-dialog";

interface ChatHeaderActionsProps {
  onOpenInfo?: () => void;
}

export function ChatHeaderActions({ onOpenInfo }: ChatHeaderActionsProps) {
  const { roomId, roomType, members, currentUserId } = useRoomContext();
  const [dialogOpen, setDialogOpen] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();
  const confirm = useConfirm();

  const isGroup = roomType === "group";
  const currentUser = members.find((member) => member.id === currentUserId);
  const isAdmin = currentUser?.role === "admin";

  const { executeAsync: executeLeaveAsync } = useAction(leaveGroup, {
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: CHAT_ROOMS_KEY });
      router.push("/chat");
    },
    onError: ({ error }) => {
      toast.add({ title: "Error", description: error.serverError });
    },
  });

  const handleLeaveGroup = () =>
    confirm({
      title: "Leave group?",
      description: "You will no longer have access to this group's messages.",
      confirmLabel: "Leave group",
      onConfirm: async () => {
        await executeLeaveAsync({ roomId });
      },
    });

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant="ghost" size="icon" aria-label="Room actions" />
          }
        >
          <MoreHorizontalIcon />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" side="bottom">
          <DropdownMenuItem onClick={onOpenInfo}>
            <InfoIcon />
            {isGroup ? "Group info" : "Chat info"}
          </DropdownMenuItem>

          {isGroup && isAdmin && (
            <DropdownMenuItem onClick={() => setDialogOpen(true)}>
              <UserPlusIcon />
              Add members
            </DropdownMenuItem>
          )}

          {isGroup && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                onClick={handleLeaveGroup}
              >
                <LogOutIcon />
                Leave group
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {isGroup && isAdmin && (
        <AddGroupMemberDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          roomId={roomId}
        />
      )}
    </>
  );
}
