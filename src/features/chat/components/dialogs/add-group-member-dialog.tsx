"use client";

import { LoaderCircleIcon } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRoomData } from "@/features/chat/queries/useRoomData";
import type { SearchUser } from "@/features/chat-list/components/user-search/user-item";
import { UserSearch } from "@/features/chat-list/components/user-search/user-search";
import { addGroupMember } from "@/features/common/actions/add-group-member";
import { SelectedMemberBadges } from "@/features/common/components/selected-member-badges";

export function AddGroupMemberDialog({
  open,
  onOpenChange,
  roomId,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  roomId: string;
}) {
  const { members } = useRoomData();
  const existingMemberIds = members.map((m) => m.id);
  const [selectedUsers, setSelectedUsers] = useState<SearchUser[]>([]);
  const { execute, isExecuting, result } = useAction(addGroupMember, {
    onSuccess: () => {
      setSelectedUsers([]);
      onOpenChange(false);
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg gap-4">
        <DialogHeader>
          <DialogTitle>Add members</DialogTitle>
          <DialogDescription>
            Search for a user to add to this group.
          </DialogDescription>
        </DialogHeader>

        <SelectedMemberBadges
          members={selectedUsers}
          onRemove={(id) =>
            setSelectedUsers((users) => users.filter((u) => u.id !== id))
          }
          disabled={isExecuting}
          emptyMessage="Select users below."
        />

        <UserSearch
          excludedUserIds={existingMemberIds}
          onSelectUser={(user) =>
            setSelectedUsers((users) =>
              users.some((selected) => selected.id === user.id)
                ? users.filter((selected) => selected.id !== user.id)
                : [...users, user],
            )
          }
          selectedUserIds={selectedUsers.map((user) => user.id)}
          disabled={isExecuting}
          placeholder="Search users to add..."
          className="max-h-56 border border-border"
        />

        <Button
          type="button"
          onClick={() =>
            execute({
              roomId,
              userIds: selectedUsers.map((user) => user.id),
            })
          }
          disabled={isExecuting || selectedUsers.length === 0}
          className="w-full"
        >
          {isExecuting && (
            <LoaderCircleIcon className="mr-2 size-4 animate-spin" />
          )}
          Add {selectedUsers.length || ""} member
          {selectedUsers.length === 1 ? "" : "s"}
        </Button>

        {result.serverError && (
          <div className="border-t border-border p-3 text-center text-sm text-destructive">
            {result.serverError}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
