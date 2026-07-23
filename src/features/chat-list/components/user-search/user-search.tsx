"use client";

import { useEffect, useState } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Skeleton } from "@/components/ui/skeleton";
import {
  type SearchUser,
  UserItem,
} from "@/features/chat-list/components/user-search/user-item";
import { useUserSearchQuery } from "@/features/chat-list/queries/search-users";

interface UserSearchProps {
  onSelectUser: (user: SearchUser) => void;
  selectedUserIds?: string[];
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

export function UserSearch({
  onSelectUser,
  selectedUserIds = [],
  disabled = false,
  placeholder = "Search users by username...",
  className = "max-h-[min(20rem,50vh)]",
}: UserSearchProps) {
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setSearch(input.trim());
    }, 250);

    return () => window.clearTimeout(timeoutId);
  }, [input]);

  const { users, isSearching, showSearchError } = useUserSearchQuery(search);
  const selectedSet = new Set(selectedUserIds);

  return (
    <Command shouldFilter={false} className={className}>
      <CommandInput
        placeholder={placeholder}
        value={input}
        onValueChange={setInput}
      />
      <CommandList>
        {input.trim().length < 3 ? (
          <CommandEmpty>Type at least 3 characters to search.</CommandEmpty>
        ) : isSearching ? (
          <UserSearchSkeleton />
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
                disabled={disabled}
                isSelected={selectedSet.has(user.id)}
                onSelect={() => onSelectUser(user)}
              />
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </Command>
  );
}

function UserSearchSkeleton({ count = 3 }: { count?: number }) {
  return (
    <CommandGroup>
      {Array.from({ length: count }).map((_, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: fixed number of static skeletons
        <CommandItem key={index} disabled className="gap-3 py-2">
          <Skeleton className="size-6 rounded-full" />
          <span className="flex flex-1 flex-col gap-1">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-2.5 w-20" />
          </span>
        </CommandItem>
      ))}
    </CommandGroup>
  );
}
