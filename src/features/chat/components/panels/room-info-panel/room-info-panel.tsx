"use client";

import { LogOut, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
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
import { useChatStore } from "@/features/chat/components/layout/chat-provider";
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
  const title = useChatStore((s) => s.title);
  const image = useChatStore((s) => s.image);
  const subtitle = useChatStore((s) => s.subtitle);
  const members = useChatStore((s) => s.members);
  const roomType = useChatStore((s) => s.roomType);
  const currentUserId = useChatStore((s) => s.currentUserId);
  const group = useChatStore((s) => s.group);
  const roomId = useChatStore((s) => s.roomId);
  const isMobile = useIsMobile();
  const isGroup = roomType === "group";
  const router = useRouter();
  const confirm = useConfirm();

  const currentUserRole = members.find((m) => m.id === currentUserId)?.role;
  const isAdmin = currentUserRole === "admin";

  const onSuccess = () => {
    onOpenChange(false);
    router.push("/chat");
  };

  const { executeAsync: executeDeleteAsync } = useAction(deleteChat, { onSuccess });
  const { executeAsync: executeLeaveAsync } = useAction(leaveGroup, { onSuccess });

  const handleLeave = () =>
    confirm({
      title: "Leave group?",
      description: "You will no longer have access to this group's messages.",
      confirmLabel: "Leave group",
      onConfirm: async () => { await executeLeaveAsync({ roomId }); },
    });

  const handleDelete = () =>
    confirm({
      title: isGroup ? "Delete group?" : "Delete conversation?",
      description: isGroup
        ? "This will permanently delete the group and all its messages for everyone."
        : "This will permanently delete messages for both participants.",
      confirmLabel: isGroup ? "Delete group" : "Delete",
      onConfirm: async () => { await executeDeleteAsync({ roomId }); },
    });

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
    </>
  );
}
