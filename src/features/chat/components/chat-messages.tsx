import { useMemo } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageFooter,
  MessageGroup,
  MessageHeader,
} from "@/components/ui/message";
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@/components/ui/message-scroller";
import type { User } from "@/types/user";
import type { MessageType } from "@/lib/db/schema";

// Groups consecutive messages from the same sender so avatar/name only
// render once per run, matching MessageGroup's intended usage.
function groupMessages(messages: MessageType[]) {
  const groups: MessageType[][] = [];
  for (const message of messages) {
    const lastGroup = groups[groups.length - 1];
    const lastMessage = lastGroup?.[lastGroup.length - 1];
    if (lastMessage && lastMessage.senderId === message.senderId) {
      lastGroup.push(message);
    } else {
      groups.push([message]);
    }
  }
  return groups;
}

export function ChatMessages({
  messages,
  members,
  roomType,
  currentUserId,
}: {
  messages: MessageType[];
  members: User[];
  roomType: "dm" | "group";
  currentUserId: string | undefined;
}) {
  const memberById = useMemo(
    () => new Map(members.map((member) => [member.id, member])),
    [members],
  );

  const groupedMessages = useMemo(() => groupMessages(messages), [messages]);

  return (
    <MessageScrollerProvider autoScroll defaultScrollPosition="end">
      <MessageScroller className="flex-1">
        <MessageScrollerViewport>
          <MessageScrollerContent className="gap-4 px-4 py-5">
            {groupedMessages.length === 0 ? (
              <Empty>
                <EmptyHeader>
                  <EmptyTitle>No messages yet</EmptyTitle>
                  <EmptyDescription>
                    Start the conversation by typing a message below.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : (
              groupedMessages.map((group) => {
                const sender = memberById.get(group[0].senderId);
                const isMine = group[0].senderId === currentUserId;
                const lastInGroup = group.length - 1;

                return (
                  <MessageGroup key={group[0].id}>
                    {group.map((message, i) => (
                      <MessageScrollerItem
                        key={message.id}
                        messageId={message.id}
                        scrollAnchor={isMine && i === lastInGroup}
                        className="w-full"
                      >
                        <Message align={isMine ? "end" : "start"} className="">
                          {i === lastInGroup && roomType === "group" && (
                            <MessageAvatar>
                              <Avatar className="size-7">
                                <AvatarImage
                                  src={sender?.image ?? undefined}
                                  alt={sender?.name}
                                />
                                <AvatarFallback>
                                  {sender?.name?.charAt(0).toUpperCase() ?? "?"}
                                </AvatarFallback>
                              </Avatar>
                            </MessageAvatar>
                          )}
                          <MessageContent>
                            {roomType === "group" && !isMine && i === 0 && (
                              <MessageHeader>{sender?.name}</MessageHeader>
                            )}
                            <div
                              className={
                                isMine
                                  ? "rounded-2xl rounded-br-sm bg-primary px-3 py-2 text-sm text-primary-foreground w-fit self-end"
                                  : "rounded-2xl rounded-bl-sm bg-muted px-3 py-2 text-sm text-foreground w-fit"
                              }
                            >
                              <p className="whitespace-pre-wrap wrap-break-word">
                                {message.content}
                              </p>
                            </div>
                            {i === lastInGroup && (
                              <MessageFooter>
                                {new Date(message.createdAt).toLocaleTimeString(
                                  [],
                                  {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  },
                                )}
                              </MessageFooter>
                            )}
                          </MessageContent>
                        </Message>
                      </MessageScrollerItem>
                    ))}
                  </MessageGroup>
                );
              })
            )}
          </MessageScrollerContent>
        </MessageScrollerViewport>
        <MessageScrollerButton />
      </MessageScroller>
    </MessageScrollerProvider>
  );
}
