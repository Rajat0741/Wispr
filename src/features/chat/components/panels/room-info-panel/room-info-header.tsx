"use client";

import { AvatarWithLabel } from "@/features/common/components/avatar-with-label";

type RoomInfoHeaderProps = {
  title: string;
  image: string | null;
  subtitle?: string | null;
  description?: string | null;
};

export function RoomInfoHeader({
  title,
  image,
  subtitle,
  description,
}: RoomInfoHeaderProps) {
  return (
    <AvatarWithLabel
      name={title}
      image={image}
      title={title}
      subtitle={subtitle ?? description ?? null}
      side="bottom"
      avatarClassName="size-20 text-2xl"
      titleClassName="text-base"
    />
  );
}
