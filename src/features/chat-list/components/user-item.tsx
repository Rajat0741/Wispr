import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CommandItem } from "@/components/ui/command";

export type SearchUser = {
  id: string;
  username: string | null;
  name: string;
  image: string | null;
};

export function UserItem({
  user,
  disabled,
  onSelect,
}: {
  user: SearchUser;
  disabled: boolean;
  onSelect: () => void;
}) {
  const fallback = user.name.charAt(0).toUpperCase() || "?";

  return (
    <CommandItem
      value={`${user.name} ${user.username ?? ""}`}
      disabled={disabled}
      onSelect={onSelect}
      className="gap-3 py-2"
    >
      <Avatar size="sm">
        <AvatarImage
          src={user.image ?? undefined}
          alt={`${user.name}'s avatar`}
        />
        <AvatarFallback>{fallback}</AvatarFallback>
      </Avatar>
      <span className="flex min-w-0 flex-col">
        <span className="truncate font-medium">{user.name}</span>
        <span className="truncate text-xs text-muted-foreground">
          @{user.username ?? "username unavailable"}
        </span>
      </span>
    </CommandItem>
  );
}
