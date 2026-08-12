import { UserProfilePopover } from "@/features/common/components/user-profile-popover";

const mentionPattern = /(^|[^\w@])@([A-Za-z0-9_]{3,30})(?![A-Za-z0-9_])/g;
const codePattern = /(```[\s\S]*?```|`[^`\n]*`)/g;

export function renderMentions(content: string) {
  const parts = content.split(codePattern);

  return parts
    .map((part, index) => {
      if (index % 2 === 1) return part;

      return part.replace(
        mentionPattern,
        (_, prefix: string, username: string) =>
          `${prefix}<mention username="${username}">@${username}</mention>`,
      );
    })
    .join("");
}

export function ChatMessageMention({ username }: { username?: string }) {
  if (typeof username !== "string" || !username) return null;

  return (
    <UserProfilePopover username={username} render={<span />}>
      <span className="cursor-pointer text-blue-500 hover:underline">
        @{username}
      </span>
    </UserProfilePopover>
  );
}
