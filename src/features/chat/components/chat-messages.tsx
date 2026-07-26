"use client";

import { format } from "date-fns";
import { ArrowDownIcon, Loader2Icon } from "lucide-react";
import { useEffect } from "react";
import { Streamdown } from "streamdown";
import { Bubble, BubbleContent } from "@/components/ui/bubble";
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
  useMessageScrollerScrollable,
} from "@/components/ui/message-scroller";
import { useMessages } from "@/features/chat/queries/useMessages";
import type { MessageWithSender } from "@/features/chat/types";
import { UserAvatar } from "@/features/common/components/user-avatar";
import { cn } from "@/lib/utils";
import { ChatMessagesSkeleton } from "./chat-messages-skeleton";

// Groups consecutive messages from the same sender so avatar/name only
// render once per run, matching MessageGroup's intended usage.
function groupMessages(messages: MessageWithSender[]) {
  const groups: MessageWithSender[][] = [];
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
  roomId,
  roomType,
  currentUserId,
}: {
  roomId: string;
  roomType: "dm" | "group";
  currentUserId: string | undefined;
}) {
  return (
    <MessageScrollerProvider autoScroll defaultScrollPosition="end">
      <ChatMessageList
        roomId={roomId}
        roomType={roomType}
        currentUserId={currentUserId}
      />
    </MessageScrollerProvider>
  );
}

function ChatMessageList({
  roomId,
  roomType,
  currentUserId,
}: {
  roomId: string;
  roomType: "dm" | "group";
  currentUserId: string | undefined;
}) {
  const {
    messages,
    isPending,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = useMessages(roomId);

  const { start } = useMessageScrollerScrollable();

  useEffect(() => {
    if (!start && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [start, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isPending) {
    return <ChatMessagesSkeleton />;
  }

  const groupedMessages = groupMessages(messages);

  return (
    <MessageScroller className="flex-1">
      <MessageScrollerViewport className="mask-none [webkit-mask-image:none]">
        <MessageScrollerContent className="gap-4 px-4 py-5">
          {isFetchingNextPage && (
            <div className="flex h-6 items-center justify-center">
              <Loader2Icon className="size-4 animate-spin text-muted-foreground" />
            </div>
          )}

          {groupedMessages.length === 0 ? (
            <ChatEmptyState />
          ) : (
            groupedMessages.map((group) => {
              const sender = group[0].sender;
              const isMine = group[0].senderId === currentUserId;
              const lastInGroup = group.length - 1;

              return (
                <MessageGroup key={group[0].id} className="gap-1">
                  {group.map((message, i) => (
                    <MessageScrollerItem
                      key={message.id}
                      messageId={message.id}
                      scrollAnchor={isMine && i === lastInGroup}
                    >
                      <Message align={isMine ? "end" : "start"}>
                        {roomType === "group" && (
                          <MessageAvatar
                            className={cn(i !== lastInGroup && "invisible")}
                          >
                            <UserAvatar
                              name={sender?.name}
                              image={sender?.image}
                              className="size-7"
                            />
                          </MessageAvatar>
                        )}
                        <MessageContent>
                          {roomType === "group" && !isMine && i === 0 && (
                            <MessageHeader>{sender?.name}</MessageHeader>
                          )}
                          <Bubble variant={isMine ? "default" : "muted"}>
                            <BubbleContent className="typeset typeset-docs max-w-2xl">
                              <Streamdown>{message.content}</Streamdown>
                            </BubbleContent>
                          </Bubble>
                          {i === lastInGroup && (
                            <MessageFooter>
                              {format(new Date(message.createdAt), "h:mm a")}
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
      <MessageScrollerButton
        size="icon"
        className="left-auto right-8 bottom-4 size-10 rounded-full shadow-md border border-border bg-background text-foreground hover:bg-muted z-20"
      >
        <ArrowDownIcon className="size-5" />
        <span className="sr-only">Scroll to bottom</span>
      </MessageScrollerButton>
    </MessageScroller>
  );
}

function ChatEmptyState() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyTitle>No messages yet</EmptyTitle>
        <EmptyDescription>
          Start the conversation by typing a message below.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
