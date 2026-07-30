"use client";

import { MoreHorizontalIcon, UserPlusIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRoomContext } from "@/features/chat/context/room-context";
import { AddGroupMemberDialog } from "./add-group-member-dialog";

export function ChatHeaderActions() {
  const { roomId, roomType, members, currentUserId } = useRoomContext();
  const [dialogOpen, setDialogOpen] = useState(false);

  const currentUser = members.find((member) => member.id === currentUserId);

  if (roomType !== "group" || currentUser?.role !== "admin") return null;

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
          <DropdownMenuItem onClick={() => setDialogOpen(true)}>
            <UserPlusIcon />
            Add members
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AddGroupMemberDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        roomId={roomId}
      />
    </>
  );
}
