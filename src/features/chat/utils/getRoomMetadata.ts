import { formatDistanceToNow } from "date-fns";
import type { GroupType } from "@/lib/db/schema";
import type { User } from "@/types/user";

export function getRoomMetadata(
  roomType: "dm" | "group",
  members: User[],
  currentUserId: string | undefined,
  group?: GroupType | null,
) {
  if (roomType === "dm") {
    const partner = members.find((member) => member.id !== currentUserId);
    return {
      title: partner?.name ?? "Direct Message",
      image: partner?.image ?? null,
      subtitle: partner?.lastActiveAt
        ? `Last seen ${formatDistanceToNow(new Date(partner.lastActiveAt), { addSuffix: true })}`
        : "Last seen Never",
    };
  }

  return {
    title: group?.name ?? `${members.length} members`,
    image: group?.groupImage ?? null,
    subtitle: members.map((member) => member.name).join(", "),
  };
}
