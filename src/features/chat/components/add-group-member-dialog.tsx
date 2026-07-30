"use client";

import { LoaderCircleIcon, XIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { SearchUser } from "@/features/chat-list/components/user-search/user-item";
import { UserSearch } from "@/features/chat-list/components/user-search/user-search";
import { addGroupMember } from "@/features/common/actions/add-group-member";
import { UserAvatar } from "@/features/common/components/user-avatar";

export function AddGroupMemberDialog({
  open,
  onOpenChange,
  roomId,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  roomId: string;
}) {
  const router = useRouter();
  const [selectedUsers, setSelectedUsers] = useState<SearchUser[]>([]);
  const { execute, isExecuting, result } = useAction(addGroupMember, {
    onSuccess: () => {
      setSelectedUsers([]);
      onOpenChange(false);
      router.refresh();
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

        <div className="flex min-h-10 flex-wrap items-center gap-1.5 border border-border bg-muted/40 p-2">
          {selectedUsers.length === 0 ? (
            <span className="px-1 text-xs italic text-muted-foreground">
              Select users below.
            </span>
          ) : (
            selectedUsers.map((user) => (
              <Badge
                key={user.id}
                variant="outline"
                className="flex items-center gap-2 px-2.5 py-3.5 text-base"
              >
                <UserAvatar
                  name={user.name}
                  image={user.image}
                  className="size-4"
                  fallbackClassName="text-[10px]"
                />
                <span className="max-w-25 truncate">{user.name}</span>
                <button
                  type="button"
                  onClick={() =>
                    setSelectedUsers((users) =>
                      users.filter((selected) => selected.id !== user.id),
                    )
                  }
                  disabled={isExecuting}
                  className="transition-colors hover:text-destructive focus:outline-none"
                  title={`Remove ${user.name}`}
                >
                  <XIcon className="size-4" />
                </button>
              </Badge>
            ))
          )}
        </div>

        <UserSearch
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

        {isExecuting && (
          <div className="flex items-center justify-center gap-2 border-t border-border p-3 text-sm text-muted-foreground">
            <LoaderCircleIcon className="size-4 animate-spin" />
            Adding member...
          </div>
        )}
        {result.serverError && (
          <div className="border-t border-border p-3 text-center text-sm text-destructive">
            {result.serverError}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
