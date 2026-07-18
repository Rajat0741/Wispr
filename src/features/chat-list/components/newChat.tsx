"use client";

import { betterFetch } from "@better-fetch/fetch";
import { useQuery } from "@tanstack/react-query";
import { LoaderCircleIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { useEffect, useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Skeleton } from "@/components/ui/skeleton";
import { createDm } from "@/features/chat-list/actions/create-dm";
import {
  type SearchUser,
  UserItem,
} from "@/features/chat-list/components/user-item";

const usersSchema = z.array(
  z.object({
    id: z.string(),
    username: z.string().nullable(),
    name: z.string(),
    image: z.string().nullable(),
  }),
);

async function searchUsers(username: string): Promise<SearchUser[]> {
  const { data, error } = await betterFetch<unknown>(
    `/api/search-user/${encodeURIComponent(username)}`,
    { output: usersSchema },
  );

  if (error) {
    throw new Error(error.message || "Unable to search users.");
  }

  return usersSchema.parse(data ?? []);
}

export function NewChat() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setSearch(input.trim());
    }, 250);

    return () => window.clearTimeout(timeoutId);
  }, [input]);

  const usersQuery = useQuery({
    queryKey: ["user-search", search],
    queryFn: () => searchUsers(search),
    enabled: search.length >= 3,
    staleTime: 30000,
    retry: 1,
  });

  const { execute, isExecuting, result } = useAction(createDm, {
    onSuccess: async ({ data }) => {
      if (!data?.roomId) return;
      setOpen(false);
      setInput("");
      router.push(`/chat/${data.roomId}`);
    },
  });

  const actionError = result.serverError;
  const showSearchError = usersQuery.isError && search.length >= 3;
  const isSearching = usersQuery.isPending && search.length >= 3;
  const users = usersQuery.data ?? [];

  return (
    <>
      <Button
        type="button"
        className="absolute right-6 bottom-6 z-40 rounded-full shadow-lg"
        onClick={() => setOpen(true)}
      >
        New chat
      </Button>
      <CommandDialog
        open={open}
        onOpenChange={(nextOpen) => {
          setOpen(nextOpen);
          if (!nextOpen) {
            setInput("");
            setSearch("");
          }
        }}
        title="New chat"
        description="Search for a user to start a direct message."
        className="sm:max-w-lg"
      >
        <Command shouldFilter={false} className="max-h-[min(32rem,70vh)]">
          <CommandInput
            placeholder="Search users by username..."
            value={input}
            onValueChange={setInput}
          />
          <CommandList>
            {input.trim().length < 3 ? (
              <CommandEmpty>Type at least 3 characters to search.</CommandEmpty>
            ) : isSearching ? (
              <CommandGroup>
                {["first", "second", "third"].map((item) => (
                  <CommandItem key={item} disabled className="gap-3 py-2">
                    <Skeleton className="size-6 rounded-full" />
                    <span className="flex flex-1 flex-col gap-1">
                      <Skeleton className="h-3 w-28" />
                      <Skeleton className="h-2.5 w-20" />
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            ) : showSearchError ? (
              <CommandEmpty>Unable to search users. Try again.</CommandEmpty>
            ) : users.length === 0 ? (
              <CommandEmpty>No users found.</CommandEmpty>
            ) : (
              <CommandGroup heading="Users">
                {users.map((user) => (
                  <UserItem
                    key={user.id}
                    user={user}
                    disabled={isExecuting}
                    onSelect={() => execute({ userId: user.id })}
                  />
                ))}
              </CommandGroup>
            )}
            {isExecuting && (
              <CommandItem
                disabled
                className="justify-center text-muted-foreground"
              >
                <LoaderCircleIcon className="animate-spin" />
                Creating conversation...
              </CommandItem>
            )}
            {actionError && input.trim().length >= 3 && (
              <CommandEmpty>{actionError}</CommandEmpty>
            )}
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
}
