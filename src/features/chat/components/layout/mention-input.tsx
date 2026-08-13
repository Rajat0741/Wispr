"use client";

import type { KeyboardEvent } from "react";
import { Mention, MentionsInput } from "react-mentions-ts";
import type { RoomMember } from "@/features/chat/queries/useRoomDataQuery";
import { UserAvatar } from "@/features/common/components/user-avatar";
import { useIsMobile } from "@/hooks/use-mobile";

type MentionMember = {
  name: string | null;
  image: string | null;
  username: string;
};

type MentionInputProps = {
  members: RoomMember[];
  value: string;
  onChange: (value: string, plainTextValue: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
};

export function MentionInput({
  members,
  value,
  onChange,
  onSubmit,
  disabled = false,
}: MentionInputProps) {
  const isMobile = useIsMobile();

  const mentionData = members.flatMap((member) => {
    if (!member.username) return [];

    return [
      {
        id: member.username,
        // Keep the plain-text value compatible with the message mention parser.
        display: member.username,
        name: member.name ?? null,
        image: member.image ?? null,
        username: member.username,
      },
    ];
  });

  const handleKeyDown = (
    event: KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    if (!isMobile && event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      onSubmit();
    }
  };

  return (
    <MentionsInput<MentionMember>
      placeholder="Type a message..."
      value={value}
      onMentionsChange={({ value: nextValue, plainTextValue }) =>
        onChange(nextValue, plainTextValue)
      }
      maxLength={10000}
      disabled={disabled}
      suggestionsPlacement="above"
      className="min-h-0 flex-1 mb-2"
      classNames={{
        control: "relative bg-transparent border-none pb-0.5 pl-2",
        highlighter: "min-h-6 max-h-36 ",
        highlighterSubstring: "text-foreground",
        input:
          "min-h-6 max-h-36 resize-none border-0 bg-transparent px-0 leading-6 outline-none text-transparent caret-foreground placeholder:text-muted-foreground focus-visible:ring-0 [field-sizing:content]",
        suggestions:
          "mb-1 rounded-xl border bg-popover p-1 text-popover-foreground shadow-md",
        suggestionsList: "max-h-64 overflow-y-auto",
        suggestionItem:
          "flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-sm",
        suggestionItemFocused: "bg-muted",
        suggestionDisplay: "min-w-0",
      }}
      onKeyDown={handleKeyDown}
    >
      <Mention<MentionMember>
        trigger="@"
        data={mentionData}
        appendSpaceOnAdd
        className="text-blue-500! bg-blue-500/10 font-medium"
        displayTransform={(id, display) => `@${display ?? id}`}
        renderSuggestion={(member) => (
          <div className="flex min-w-0 items-center gap-2">
            <UserAvatar
              name={member.name}
              image={member.image}
              className="size-7 shrink-0"
            />
            <div className="min-w-0">
              <p className="truncate font-medium">
                {member.name}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                @{member.username}
              </p>
            </div>
          </div>
        )}
      />
    </MentionsInput>
  );
}
