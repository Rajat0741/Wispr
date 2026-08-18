"use client";

import { useEffect, useMemo, useState } from "react";
import { SearchIcon, SendHorizonalIcon, XIcon } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/components/ui/toast";
import { forwardMessage } from "@/features/chat/actions/forwardMessage";
import { useChatRoomsQuery } from "@/features/chat-list/queries/get-chat-rooms";
import { useChatStore } from "@/features/chat/components/layout/chat-provider";
import { cn } from "@/lib/utils";

export interface ForwardableRoom {
  roomId: string;
  name?: string | null;
  avatarUrl?: string | null;
}

export interface ForwardDialogProps {
  messageId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export interface ForwardDialogViewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  availableRooms: ForwardableRoom[];
  selectedRoomIds: string[];
  onToggleRoomSelection: (roomId: string) => void;
  onForward: () => void;
  isPending: boolean;
}

function initials(name?: string | null) {
  if (!name) return "?";
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
}

interface ChatRowProps {
  room: ForwardableRoom;
  selected: boolean;
  onToggle: () => void;
}

function ChatRow({ room, selected, onToggle }: ChatRowProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors hover:bg-accent"
    >
      <div className="relative shrink-0">
        <Avatar className="h-11 w-11">
          <AvatarImage src={room.avatarUrl ?? undefined} alt="" />
          <AvatarFallback>{initials(room.name)}</AvatarFallback>
        </Avatar>
        <span
          className={cn(
            "absolute -bottom-0.5 -right-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full border-2 border-background transition-colors",
            selected ? "bg-primary" : "bg-muted"
          )}
        >
          {selected && (
            <svg
              viewBox="0 0 12 12"
              className="h-2.5 w-2.5 fill-none stroke-primary-foreground stroke-[2.5]"
            >
              <path d="M2 6l2.5 2.5L10 3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </span>
      </div>
      <span className="truncate text-sm font-medium">
        {room.name || "Unknown"}
      </span>
    </button>
  );
}

interface SelectedStripProps {
  rooms: ForwardableRoom[];
  onRemove: (roomId: string) => void;
}

function SelectedStrip({ rooms, onRemove }: SelectedStripProps) {
  if (rooms.length === 0) return null;

  return (
    <ScrollArea className="w-full whitespace-nowrap">
      <div className="flex gap-3 px-4 pb-3 pt-1">
        {rooms.map((room) => (
          <div key={room.roomId} className="flex w-14 shrink-0 flex-col items-center gap-1">
            <div className="relative">
              <Avatar className="h-12 w-12">
                <AvatarImage src={room.avatarUrl ?? undefined} alt="" />
                <AvatarFallback>{initials(room.name)}</AvatarFallback>
              </Avatar>
              <button
                type="button"
                onClick={() => onRemove(room.roomId)}
                className="absolute -right-1 -top-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-foreground/70 text-background hover:bg-foreground"
              >
                <XIcon className="h-3 w-3" />
              </button>
            </div>
            <span className="w-full truncate text-center text-[11px] text-muted-foreground">
              {room.name || "Unknown"}
            </span>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}

export function ForwardDialogView({
  open,
  onOpenChange,
  availableRooms,
  selectedRoomIds,
  onToggleRoomSelection,
  onForward,
  isPending,
}: ForwardDialogViewProps) {
  const [query, setQuery] = useState("");

  const filteredRooms = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return availableRooms;
    return availableRooms.filter((room) =>
      (room.name || "unknown").toLowerCase().includes(q)
    );
  }, [availableRooms, query]);

  const selectedRooms = useMemo(
    () =>
      selectedRoomIds
        .map((id) => availableRooms.find((r) => r.roomId === id))
        .filter((r): r is ForwardableRoom => Boolean(r)),
    [availableRooms, selectedRoomIds]
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="flex h-dvh w-screen max-w-none flex-col gap-0 rounded-none p-0 sm:h-[85vh] sm:max-h-[640px] sm:w-full sm:max-w-sm sm:rounded-2xl"
      >
        <div className="flex items-center gap-3 border-b px-4 py-3">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0"
            onClick={() => onOpenChange(false)}
          >
            <XIcon className="h-4.5 w-4.5" />
          </Button>
          <DialogTitle className="text-base font-semibold">
            Forward message
          </DialogTitle>
        </div>

        <div className="px-4 py-3">
          <div className="relative">
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search chats"
              className="rounded-full bg-muted pl-9"
            />
          </div>
        </div>

        <ScrollArea className="flex-1 px-2">
          <div className="flex flex-col gap-0.5 pb-2">
            {filteredRooms.length === 0 ? (
              <p className="px-3 py-6 text-center text-sm text-muted-foreground">
                No chats found
              </p>
            ) : (
              filteredRooms.map((room) => (
                <ChatRow
                  key={room.roomId}
                  room={room}
                  selected={selectedRoomIds.includes(room.roomId)}
                  onToggle={() => onToggleRoomSelection(room.roomId)}
                />
              ))
            )}
          </div>
        </ScrollArea>

        <div className="border-t">
          <SelectedStrip rooms={selectedRooms} onRemove={onToggleRoomSelection} />
          <div className="flex items-center justify-between px-4 py-3">
            <span className="text-sm text-muted-foreground">
              {selectedRoomIds.length > 0
                ? `${selectedRoomIds.length} selected`
                : "Select chats to forward to"}
            </span>
            <Button
              type="button"
              size="icon"
              className="h-10 w-10 rounded-full"
              onClick={onForward}
              disabled={selectedRoomIds.length === 0 || isPending}
            >
              <SendHorizonalIcon className="h-4.5 w-4.5" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function ForwardDialog({
  messageId,
  open,
  onOpenChange,
}: ForwardDialogProps) {
  const roomId = useChatStore((s) => s.roomId);
  const { rooms } = useChatRoomsQuery();
  const [selectedRoomIds, setSelectedRoomIds] = useState<string[]>([]);

  // Selection is tied to a specific message; clear it whenever the dialog
  // opens/closes or the target message changes so picks don't leak across messages.
  useEffect(() => {
    setSelectedRoomIds([]);
  }, [open, messageId]);

  const { execute, isPending } = useAction(forwardMessage, {
    onSuccess: () => {
      toast.add({ title: "Message forwarded" });
      onOpenChange(false);
      setSelectedRoomIds([]);
    },
    onError: ({ error }) => {
      toast.add({
        title: "Failed to forward message",
        description: error.serverError,
      });
    },
  });

  const handleForward = () => {
    if (selectedRoomIds.length === 0) return;
    execute({
      roomId,
      messageId,
      targetRoomIds: selectedRoomIds,
    });
  };

  const toggleRoomSelection = (targetRoomId: string) => {
    setSelectedRoomIds((prev) =>
      prev.includes(targetRoomId)
        ? prev.filter((id) => id !== targetRoomId)
        : [...prev, targetRoomId]
    );
  };

  const availableRooms =
    rooms?.filter((room) => room.roomId !== roomId) || [];

  return (
    <ForwardDialogView
      open={open}
      onOpenChange={onOpenChange}
      availableRooms={availableRooms}
      selectedRoomIds={selectedRoomIds}
      onToggleRoomSelection={toggleRoomSelection}
      onForward={handleForward}
      isPending={isPending}
    />
  );
}
