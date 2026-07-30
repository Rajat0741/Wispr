"use client";

import { LogOut, Trash2 } from "lucide-react";
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
import { useRoomContext } from "@/features/chat/context/room-context";
import { deleteChat } from "@/features/common/actions/delete-chat";
import { leaveGroup } from "@/features/common/actions/leave-group";
import { ConfirmDialog } from "@/features/common/components/confirm-dialog";
import { useIsMobile } from "@/hooks/use-mobile";
import { RoomInfoHeader } from "./room-info-header";
import { RoomMemberList } from "./room-member-list";

type RoomInfoPanelProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function RoomInfoPanel({ open, onOpenChange }: RoomInfoPanelProps) {
  const { title, image, subtitle, members, roomType, currentUserId, group, roomId } =
    useRoomContext();
  const isMobile = useIsMobile();
  const isGroup = roomType === "group";
  const [leaveOpen, setLeaveOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const router = useRouter();

  const currentUserRole = members.find((m) => m.id === currentUserId)?.role;
  const isAdmin = currentUserRole === "admin";

  const onSuccess = () => {
    onOpenChange(false);
    router.push("/chat");
  };

  const { execute: executeDelete, isExecuting: isDeleting } = useAction(
    deleteChat,
    { onSuccess },
  );

  const { execute: executeLeave, isExecuting: isLeaving } = useAction(
    leaveGroup,
    { onSuccess },
  );

  const content = (
    <div className="flex flex-col gap-6 p-4 overflow-y-auto">
      <RoomInfoHeader
        title={title}
        image={image}
        description={group?.description}
      />

      {isGroup && members.length > 0 && (
        <RoomMemberList members={members} currentUserId={currentUserId} />
      )}

      <div className="mt-auto pt-4 border-t border-border/40 flex flex-col gap-2">
        {isGroup ? (
          <>
            <Button
              variant="destructive"
              className="w-full justify-center gap-2"
              onClick={() => setLeaveOpen(true)}
            >
              <LogOut className="size-4" />
              Leave Group
            </Button>
            {isAdmin && (
              <Button
                variant="outline"
                className="w-full justify-center gap-2 text-destructive hover:text-destructive border-destructive/30 hover:bg-destructive/10"
                onClick={() => setDeleteOpen(true)}
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
            onClick={() => setDeleteOpen(true)}
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
                <SheetDescription className="sr-only">{subtitle}</SheetDescription>
              )}
            </SheetHeader>
            {content}
          </SheetContent>
        </Sheet>
      )}

      <ConfirmDialog
        open={leaveOpen}
        onOpenChange={setLeaveOpen}
        title="Leave group?"
        description="You will no longer have access to this group's messages."
        confirmLabel="Leave group"
        isLoading={isLeaving}
        onConfirm={() => executeLeave({ roomId })}
      />

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title={isGroup ? "Delete group?" : "Delete conversation?"}
        description={
          isGroup
            ? "This will permanently delete the group and all its messages for everyone."
            : "This will permanently delete messages for both participants."
        }
        confirmLabel={isGroup ? "Delete group" : "Delete"}
        isLoading={isDeleting}
        onConfirm={() => executeDelete({ roomId })}
      />
    </>
  );
}
