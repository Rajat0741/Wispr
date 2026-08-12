import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
} from "@/components/ui/item";
import { cn } from "@/lib/utils";

interface ProfileItemProps {
  icon: LucideIcon;
  label: string;
  children: ReactNode;
  className?: string;
}

export function ProfileItem({
  icon: Icon,
  label,
  children,
  className,
}: ProfileItemProps) {
  return (
    <Item className={cn("items-start", className)}>
      <ItemMedia
        variant="icon"
        className="size-8 rounded-md bg-accent"
      >
        <Icon className="size-4 text-accent-foreground" />
      </ItemMedia>
      <ItemContent className="gap-0">
        <ItemDescription className="text-xs">{label}</ItemDescription>
        {children}
      </ItemContent>
    </Item>
  );
}
