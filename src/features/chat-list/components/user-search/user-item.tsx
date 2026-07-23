import { CheckIcon } from "lucide-react";
import { CommandItem } from "@/components/ui/command";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { UserAvatar } from "@/features/common/components/user-avatar";

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
  isSelected,
}: {
  user: SearchUser;
  disabled?: boolean;
  onSelect: () => void;
  isSelected?: boolean;
}) {
  return (
    <CommandItem
      value={`${user.name} ${user.username ?? ""}`}
      disabled={disabled}
      onSelect={onSelect}
      className="p-0 border-none outline-none cursor-pointer data-selected:bg-muted [&>svg:last-child]:hidden"
    >
      <Item size="xs" className="w-full">
        <ItemMedia className="h-full flex items-center">
          <UserAvatar name={user.name} image={user.image} className="size-9" />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>{user.name}</ItemTitle>
          <ItemDescription className="line-clamp-1">
            @{user.username ?? "username unavailable"}
          </ItemDescription>
        </ItemContent>
        {isSelected && (
          <ItemActions className="pr-3">
            <CheckIcon className="size-4 text-primary" />
          </ItemActions>
        )}
      </Item>
    </CommandItem>
  );
}
