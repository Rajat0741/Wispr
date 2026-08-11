"use client";

import { XIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { UserAvatar } from "@/features/common/components/user-avatar";

export interface MemberBadgeItem {
  id: string;
  name: string;
  image?: string | null;
}

interface SelectedMemberBadgesProps {
  members: MemberBadgeItem[];
  onRemove: (id: string) => void;
  disabled?: boolean;
  emptyMessage?: string;
}

export function SelectedMemberBadges({
  members,
  onRemove,
  disabled = false,
  emptyMessage = "Select members below.",
}: SelectedMemberBadgesProps) {
  return (
    <div className="flex min-h-10 flex-wrap items-center gap-1.5 border border-border p-2 rounded-xl">
      {members.length === 0 ? (
        <span className="px-1 text-xs italic text-muted-foreground">
          {emptyMessage}
        </span>
      ) : (
        members.map((member) => (
          <Badge
            key={member.id}
            variant="outline"
            className="flex items-center gap-2 px-2 py-4 text-sm font-normal"
          >
            <UserAvatar
              name={member.name}
              image={member.image}
              className="size-5"
              fallbackClassName="text-xs"
            />
            <span className="max-w-25 truncate text-sm">{member.name}</span>
            <button
              type="button"
              onClick={() => onRemove(member.id)}
              disabled={disabled}
              className="transition-colors hover:text-destructive focus:outline-none disabled:cursor-not-allowed"
              title={`Remove ${member.name}`}
            >
              <XIcon className="size-3.5" />
            </button>
          </Badge>
        ))
      )}
    </div>
  );
}
