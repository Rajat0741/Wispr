"use client";

import { LoaderCircleIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { RiChatNewLine } from "react-icons/ri";
import { Button } from "@/components/ui/button";
import { CommandDialog } from "@/components/ui/command";
import { createDm } from "@/features/chat-list/actions/create-dm";
import { UserSearch } from "@/features/chat-list/components/user-search/user-search";

export function NewChat() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const { execute, isExecuting, result } = useAction(createDm, {
    onSuccess: async ({ data }) => {
      if (!data?.roomId) return;
      setOpen(false);
      router.push(`/chat/${data.roomId}`);
    },
  });

  const actionError = result.serverError;

  return (
    <>
      <Button
        type="button"
        className="size-8 p-4.5"
        onClick={() => setOpen(true)}
        title="New chat"
        variant="ghost"
      >
        <RiChatNewLine className="size-5 ml-0.5" />
        <span className="sr-only">New chat</span>
      </Button>
      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title="New chat"
        description="Search for a user to start a direct message."
        className="top-8 sm:max-w-lg sm:top-1/3"
      >
        <UserSearch
          disabled={isExecuting}
          onSelectUser={(user) => execute({ userId: user.id })}
        />
        {isExecuting && (
          <div className="flex items-center justify-center gap-2 p-3 text-sm text-muted-foreground border-t border-border">
            <LoaderCircleIcon className="size-4 animate-spin" />
            Creating conversation...
          </div>
        )}
        {actionError && (
          <div className="p-3 text-center text-sm text-destructive border-t border-border">
            {actionError}
          </div>
        )}
      </CommandDialog>
    </>
  );
}
