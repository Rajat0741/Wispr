"use client";

import { LogOut, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
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
import { DeleteChatDialog } from "@/features/common/components/delete-chat-dialog";
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
  const [confirmOpen, setConfirmOpen] = useState(false);
  const router = useRouter();

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

      <div className="mt-auto pt-4 border-t border-border/40">
        <Button
          variant="destructive"
          className="w-full justify-center gap-2"
          onClick={() => setConfirmOpen(true)}
        >
          {isGroup ? (
            <>
              <LogOut className="size-4" />
              Leave Group
            </>
          ) : (
            <>
              <Trash2 className="size-4" />
              Delete Chat
            </>
          )}
        </Button>
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

      <DeleteChatDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        roomId={roomId}
        isGroup={isGroup}
        onSuccess={() => {
          onOpenChange(false);
          router.push("/chat");
        }}
      />
    </>
  );
}
