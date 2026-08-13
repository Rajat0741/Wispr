"use client";

import { useAction } from "next-safe-action/hooks";
import { toast } from "@/components/ui/toast";
import { useRoomData } from "@/features/chat/queries/useRoomData";
import { updateGroupPhoto } from "@/features/common/actions/update-group-photo";
import { AvatarWithLabel } from "@/features/common/components/avatar-with-label";
import { GroupPhotoUpload } from "@/features/common/components/group-photo-upload";

export function RoomInfoHeader() {
  const { title, image, roomType, currentUserId, members, roomId } =
    useRoomData();

  const isGroup = roomType === "group";
  const currentUserRole = members.find((m) => m.id === currentUserId)?.role;
  const isAdmin = currentUserRole === "admin";
  const otherUser = members.find((m) => m.id !== currentUserId) ?? members[0];

  const headerSubtitle = isGroup ? null : `@${otherUser.username}`;

  const { execute, isExecuting } = useAction(updateGroupPhoto, {
    onSuccess: ({ data }) => {
      toast.add({
        title: data?.groupImage ? "Group photo updated" : "Group photo removed",
        type: "success",
      });
    },
    onError: ({ error }) => {
      toast.add({
        title: error.serverError ?? "Failed to update group photo",
        type: "error",
      });
    },
  });

  const handlePhotoChange = (newUrl: string | null, fileId: string | null) => {
    if (!roomId) return;
    execute({ roomId, groupImage: newUrl, groupImageFileId: fileId });
  };

  if (isGroup && isAdmin && roomId) {
    return (
      <div className="flex flex-col items-center gap-3">
        <GroupPhotoUpload
          value={image}
          onChange={handlePhotoChange}
          fallbackText={title}
          disabled={isExecuting}
          size="lg"
        />

        {title && (
          <div className="text-center">
            <p className="font-semibold text-base">{title}</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <AvatarWithLabel
      name={title}
      image={image}
      title={title}
      subtitle={headerSubtitle}
      side="bottom"
      avatarClassName="size-20 text-2xl"
      titleClassName="text-base"
    />
  );
}
