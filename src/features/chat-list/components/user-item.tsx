import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CommandItem } from "@/components/ui/command";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";

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
      className="p-0 border-none outline-none cursor-pointer data-selected:bg-muted [&>svg:last-child]:hidden"
    >
      <Item
        size="xs"
        className="w-full"
      >
        <ItemMedia className="h-full flex items-center">
          <Avatar className="size-9">
            <AvatarImage
              src={user.image ?? undefined}
              alt={`${user.name}'s avatar`}
            />
            <AvatarFallback>{fallback}</AvatarFallback>
          </Avatar>
        </ItemMedia>
        <ItemContent>
          <ItemTitle>{user.name}</ItemTitle>
          <ItemDescription className="line-clamp-1">
            @{user.username ?? "username unavailable"}
          </ItemDescription>
        </ItemContent>
      </Item>
    </CommandItem>
  );
}
