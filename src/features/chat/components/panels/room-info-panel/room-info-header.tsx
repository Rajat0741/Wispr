"use client";

import { AvatarWithLabel } from "@/features/common/components/avatar-with-label";

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
    <AvatarWithLabel
      name={title}
      image={image}
      title={title}
      subtitle={description ?? "Group Description not set"}
      side="bottom"
      avatarClassName="size-20 text-2xl"
      titleClassName="text-base"
    />
  );
}
