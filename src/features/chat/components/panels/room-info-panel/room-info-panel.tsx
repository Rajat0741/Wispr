"use client";

import { FileText, LogOut, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { EditGroupDescriptionDialog } from "@/features/chat/components/dialogs/edit-group-description-dialog";
import { useRoomData } from "@/features/chat/queries/useRoomData";
import { deleteChat } from "@/features/common/actions/delete-chat";
import { leaveGroup } from "@/features/common/actions/leave-group";
import { useIsMobile } from "@/hooks/use-mobile";
import { useConfirm } from "@/lib/providers/confirm-dialog-provider";
import { RoomInfoHeader } from "./room-info-header";
import { RoomMemberList } from "./room-member-list";

type RoomInfoPanelProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function RoomInfoPanel({ open, onOpenChange }: RoomInfoPanelProps) {
  const {
    title,
    image,
    subtitle,
    members,
    roomType,
    currentUserId,
    roomId,
    group,
  } = useRoomData();

  const isMobile = useIsMobile();
  const isGroup = roomType === "group";
  const router = useRouter();
  const confirm = useConfirm();

  const [editDescriptionOpen, setEditDescriptionOpen] = useState(false);

  const otherUser = members.find((m) => m.id !== currentUserId) ?? members[0];
  const currentUserRole = members.find((m) => m.id === currentUserId)?.role;
  const isAdmin = currentUserRole === "admin";

  const onSuccess = () => {
    onOpenChange(false);
    router.push("/chat");
  };

  const { executeAsync: executeDeleteAsync } = useAction(deleteChat, {
    onSuccess,
  });
  const { executeAsync: executeLeaveAsync } = useAction(leaveGroup, {
    onSuccess,
  });

  const handleLeave = () =>
    confirm({
      title: "Leave group?",
      description: "You will no longer have access to this group's messages.",
      confirmLabel: "Leave group",
      onConfirm: async () => {
        await executeLeaveAsync({ roomId });
      },
    });

  const handleDelete = () =>
    confirm({
      title: isGroup ? "Delete group?" : "Delete conversation?",
      description: isGroup
        ? "This will permanently delete the group and all its messages for everyone."
        : "This will permanently delete messages for both participants.",
      confirmLabel: isGroup ? "Delete group" : "Delete",
      onConfirm: async () => {
        await executeDeleteAsync({ roomId });
      },
    });

  const content = (
    <div className="flex flex-col gap-6 p-4 overflow-y-auto">
      <RoomInfoHeader
        title={title}
        image={image}
        subtitle={
          isGroup ? null : otherUser?.username ? `@${otherUser.username}` : null
        }
      />

      {!isGroup && (
        <div className="flex flex-col gap-1.5 rounded-2xl bg-muted/40 p-3.5 border border-border/40">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <FileText className="size-3.5" />
            <span className="text-xs font-semibold uppercase tracking-wider">
              Bio
            </span>
          </div>
          <p className="text-sm text-foreground wrap-break-word line-clamp-4 min-w-0 w-full">
            {otherUser?.bio && otherUser.bio.trim().length > 0
              ? otherUser.bio
              : "No bio added yet"}
          </p>
        </div>
      )}

      {isGroup && (
        <div className="flex flex-col gap-1.5 rounded-2xl bg-muted/40 p-3.5 border border-border/40">
          <div className="flex items-center justify-between text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <FileText className="size-3.5" />
              <span className="text-xs font-semibold uppercase tracking-wider">
                Group Description
              </span>
            </div>
            {isAdmin && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-6 text-muted-foreground hover:text-foreground"
                onClick={() => setEditDescriptionOpen(true)}
              >
                <Pencil className="size-3.5" />
              </Button>
            )}
          </div>
          <p className="text-sm text-foreground wrap-break-word line-clamp-4 min-w-0 w-full">
            {group?.description?.trim()
              ? group.description
              : "No description set"}
          </p>
        </div>
      )}

      {isGroup && members.length > 0 && (
        <RoomMemberList
          members={members}
          currentUserId={currentUserId}
          roomId={roomId}
          group={group}
          isAdmin={isAdmin}
        />
      )}

      <div className="mt-auto pt-4 border-t border-border/40 flex flex-col gap-2">
        {isGroup ? (
          <>
            <Button
              variant="destructive"
              className="w-full justify-center gap-2"
              onClick={handleLeave}
            >
              <LogOut className="size-4" />
              Leave Group
            </Button>
            {isAdmin && (
              <Button
                variant="outline"
                className="w-full justify-center gap-2 text-destructive hover:text-destructive border-destructive/30 hover:bg-destructive/10"
                onClick={handleDelete}
              >
                <Trash2 className="size-4" />
                Delete Group
              </Button>
            )}
          </>
        ) : (
          <Button
            variant="destructive"
            className="w-full justify-center gap-2"
            onClick={handleDelete}
          >
            <Trash2 className="size-4" />
            Delete Chat
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <>
      {isMobile ? (
        <Drawer open={open} onOpenChange={onOpenChange} showSwipeHandle>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle className="sr-only">{title} Info</DrawerTitle>
              {subtitle && (
                <DrawerDescription className="sr-only">
                  {subtitle}
                </DrawerDescription>
              )}
            </DrawerHeader>
            {content}
          </DrawerContent>
        </Drawer>
      ) : (
        <Sheet open={open} onOpenChange={onOpenChange}>
          <SheetContent side="right" className="w-80 sm:max-w-xs">
            <SheetHeader>
              <SheetTitle className="sr-only">{title} Info</SheetTitle>
              {subtitle && (
                <SheetDescription className="sr-only">
                  {subtitle}
                </SheetDescription>
              )}
            </SheetHeader>
            {content}
          </SheetContent>
        </Sheet>
      )}

      {isGroup && isAdmin && (
        <EditGroupDescriptionDialog
          roomId={roomId}
          currentDescription={group?.description}
          open={editDescriptionOpen}
          onOpenChange={setEditDescriptionOpen}
        />
      )}
    </>
  );
}
