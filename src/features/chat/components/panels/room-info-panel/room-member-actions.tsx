"use client";

import {
  EllipsisVerticalIcon,
  ShieldCheckIcon,
  ShieldOffIcon,
  UserMinusIcon,
} from "lucide-react";
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
import type { RoomMember } from "@/features/chat/queries/useRoomDataQuery";
import { removeGroupMember } from "@/features/common/actions/remove-group-member";
import { updateGroupMemberRole } from "@/features/common/actions/update-group-member-role";
import { useConfirm } from "@/lib/providers/confirm-dialog-provider";
import { cn } from "@/lib/utils";

type RoomMemberActionsProps = {
  member: RoomMember;
  roomId: string;
  className?: string;
  onOpenChange?: (open: boolean) => void;
};

export function RoomMemberActions({
  member,
  roomId,
  className,
  onOpenChange,
}: RoomMemberActionsProps) {
  const confirm = useConfirm();

  const { executeAsync: executeRemoveAsync, isExecuting: isRemoving } =
    useAction(removeGroupMember, {
      onError: ({ error }) => {
        toast.add({
          title: "Error",
          description: error.serverError ?? "Failed to remove member.",
        });
      },
    });

  const { executeAsync: executeUpdateRoleAsync, isExecuting: isUpdatingRole } =
    useAction(updateGroupMemberRole, {
      onError: ({ error }) => {
        toast.add({
          title: "Error",
          description: error.serverError ?? "Failed to update member role.",
        });
      },
    });

  const isBusy = isRemoving || isUpdatingRole;

  const handleMakeAdmin = async () => {
    await executeUpdateRoleAsync({
      roomId,
      userId: member.id,
      role: "admin",
    });
  };

  const handleDismissAdmin = async () => {
    await executeUpdateRoleAsync({
      roomId,
      userId: member.id,
      role: "member",
    });
  };

  const handleRemoveMember = () => {
    const displayName =
      member.name ?? (member.username ? `@${member.username}` : "this member");

    confirm({
      title: `Remove ${displayName}?`,
      description: "They will no longer have access to this group's messages.",
      confirmLabel: "Remove member",
      onConfirm: async () => {
        await executeRemoveAsync({ roomId, userId: member.id });
      },
    });
  };

  const username =
    "username" in member ? (member.username as string | null) : null;

  return (
    <DropdownMenu onOpenChange={onOpenChange}>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon-xs"
            className={cn(
              "size-7 text-muted-foreground hover:text-foreground shrink-0 ml-auto",
              className,
            )}
            aria-label={`Options for ${member.name ?? username ?? "member"}`}
            onClick={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
          />
        }
      >
        <EllipsisVerticalIcon className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" side="bottom">
        {member.role !== "admin" ? (
          <DropdownMenuItem onClick={handleMakeAdmin} disabled={isBusy}>
            <ShieldCheckIcon className="size-4" />
            Make group admin
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem onClick={handleDismissAdmin} disabled={isBusy}>
            <ShieldOffIcon className="size-4" />
            Dismiss as admin
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          onClick={handleRemoveMember}
          disabled={isBusy}
        >
          <UserMinusIcon className="size-4" />
          Remove from group
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
