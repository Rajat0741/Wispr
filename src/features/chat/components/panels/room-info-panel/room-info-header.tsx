"use client";

import { UserAvatar } from "@/features/common/components/user-avatar";

type RoomInfoHeaderProps = {
  title: string;
  image: string | null;
  description?: string | null;
};

export function RoomInfoHeader({
  title,
  image,
  description,
}: RoomInfoHeaderProps) {
  return (
    <div className="flex flex-col items-center gap-3">
      <UserAvatar name={title} image={image} className="size-20 text-2xl" />
      <div className="text-center">
        <p className="font-semibold text-base">{title}</p>
        <p className="text-xs text-muted-foreground mt-0.5">
          {description || "Group Description not set"}
        </p>
      </div>
    </div>
  );
}
