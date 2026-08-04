"use client";

import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import type { MessageWithSender } from "@/features/chat/types";
import { UserAvatar } from "@/features/common/components/user-avatar";
import { useIsMobile } from "@/hooks/use-mobile";

type ReplyTarget = NonNullable<MessageWithSender["replyToMessage"]>;

type ReplyTargetPanelProps = {
  replyTarget: ReplyTarget | null;
  onOpenChange: (open: boolean) => void;
};

function ReplyMessageCard({ message }: { message: ReplyTarget }) {
  return (
    <Card size="sm" className="bg-muted/60 shadow-none ring-primary/10">
      <CardHeader className="flex flex-row items-start gap-3">
        <UserAvatar
          name={message.sender?.name}
          image={message.sender?.image}
          className="size-9 shrink-0"
        />
        <div className="min-w-0 flex-1">
          <CardTitle className="truncate text-sm">
            {message.sender?.name || "Deleted User"}
          </CardTitle>
          <CardDescription className="flex flex-wrap items-center gap-1.5 text-xs">
            <Badge variant="secondary">{message.type}</Badge>
            <span>{format(new Date(message.createdAt), "PP p")}</span>
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <p className="whitespace-pre-wrap wrap-break-word text-sm">
          {message.content}
        </p>
      </CardContent>
    </Card>
  );
}

export function ReplyTargetPanel({
  replyTarget,
  onOpenChange,
}: ReplyTargetPanelProps) {
  const isMobile = useIsMobile();
  const title = "Message reply";
  const description = `Message from ${replyTarget?.sender?.name || "Unknown sender"}`;

  const content = replyTarget ? (
    <div className="p-4">
      <ReplyMessageCard message={replyTarget} />
    </div>
  ) : null;

  return isMobile ? (
    <Drawer open={!!replyTarget} onOpenChange={onOpenChange} showSwipeHandle>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription>{description}</DrawerDescription>
        </DrawerHeader>
        {content}
      </DrawerContent>
    </Drawer>
  ) : (
    <Sheet open={!!replyTarget} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-80 sm:max-w-sm">
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>{description}</SheetDescription>
        </SheetHeader>
        {content}
      </SheetContent>
    </Sheet>
  );
}
