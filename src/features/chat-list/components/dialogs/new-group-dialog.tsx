"use client";

import { useQueryClient } from "@tanstack/react-query";
import { LoaderCircleIcon, UsersIcon, XIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createGroup } from "@/features/chat-list/actions/create-group";
import type { SearchUser } from "@/features/chat-list/components/user-search/user-item";
import { UserSearch } from "@/features/chat-list/components/user-search/user-search";
import { UserAvatar } from "@/features/common/components/user-avatar";

export function NewGroupDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [name, setName] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<SearchUser[]>([]);

  const { execute, isExecuting, result } = useAction(createGroup, {
    onSuccess: async ({ data }) => {
      if (!data?.roomId) return;
      await queryClient.invalidateQueries({ queryKey: ["chat-rooms"] });
      onOpenChange(false);
      resetForm();
      router.push(`/chat/${data.roomId}`);
    },
  });

  const actionError = result.serverError;

  const resetForm = () => {
    setName("");
    setSelectedMembers([]);
  };

  const handleOpenChange = (nextOpen: boolean) => {
    onOpenChange(nextOpen);
    if (!nextOpen) {
      resetForm();
    }
  };

  const toggleMember = (user: SearchUser) => {
    setSelectedMembers((prev) => {
      const exists = prev.some((m) => m.id === user.id);
      if (exists) {
        return prev.filter((m) => m.id !== user.id);
      }
      return [...prev, user];
    });
  };

  const removeMember = (userId: string) => {
    setSelectedMembers((prev) => prev.filter((m) => m.id !== userId));
  };

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.trim() || selectedMembers.length === 0 || isExecuting) return;

    execute({
      name: name.trim(),
      memberIds: selectedMembers.map((m) => m.id),
    });
  };

  const isValid = name.trim().length > 0 && selectedMembers.length > 0;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg gap-4">
        <DialogHeader>
          <DialogTitle>Create New Group</DialogTitle>
          <DialogDescription>
            Enter a group name and search to add members.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Group Name Input */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="group-name" className="text-sm font-medium">
              Group Name
            </Label>
            <Input
              id="group-name"
              placeholder="e.g. Project Team"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isExecuting}
              maxLength={100}
              autoFocus
            />
          </div>

          {/* Selected Members Chips */}
          <div className="flex flex-col gap-1.5">
            <Label className="text-sm font-medium">
              Selected Members ({selectedMembers.length})
            </Label>
            <div className="flex flex-wrap gap-1.5 p-2 bg-muted/40 rounded-lg border border-border min-h-[3rem] items-center">
              {selectedMembers.length === 0 ? (
                <span className="text-xs text-muted-foreground italic px-1">
                  Select at least 1 member below.
                </span>
              ) : (
                selectedMembers.map((member) => (
                  <Badge
                    key={member.id}
                    variant="secondary"
                    className="flex items-center gap-1.5 py-1 px-2.5 text-xs font-normal"
                  >
                    <UserAvatar
                      name={member.name}
                      image={member.image}
                      className="size-4"
                      fallbackClassName="text-[10px]"
                    />
                    <span className="max-w-[100px] truncate">
                      {member.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeMember(member.id)}
                      disabled={isExecuting}
                      className="hover:text-destructive transition-colors focus:outline-none"
                      title={`Remove ${member.name}`}
                    >
                      <XIcon className="size-3" />
                    </button>
                  </Badge>
                ))
              )}
            </div>
          </div>

          {/* User Search & Selection */}
          <div className="flex flex-col gap-1.5">
            <Label className="text-sm font-medium">Add Members</Label>
            <UserSearch
              onSelectUser={toggleMember}
              selectedUserIds={selectedMembers.map((m) => m.id)}
              disabled={isExecuting}
              placeholder="Search users to add to group..."
              className="max-h-56 rounded-md border border-border"
            />
          </div>

          {/* Error Message */}
          {actionError && (
            <p className="text-sm text-destructive text-center">
              {actionError}
            </p>
          )}

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isExecuting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!isValid || isExecuting}
              className="gap-2"
            >
              {isExecuting && (
                <LoaderCircleIcon className="size-4 animate-spin" />
              )}
              Create Group
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function NewGroup() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        type="button"
        className="size-8 bg-transparent hover:bg-accent p-4"
        onClick={() => setOpen(true)}
        title="New group"
      >
        <UsersIcon className="size-5" />
        <span className="sr-only">New group</span>
      </Button>

      <NewGroupDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
