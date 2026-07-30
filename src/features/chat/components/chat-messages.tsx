"use client";

import { ArrowDownIcon, Loader2Icon } from "lucide-react";
import { useEffect } from "react";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import { Marker, MarkerContent } from "@/components/ui/marker";
import {
  Message,
  MessageAvatar,
  MessageContent,
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
import { useRoomContext } from "@/features/chat/context/room-context";
import { useMessages } from "@/features/chat/queries/useMessages";
import { groupMessagesByDate } from "@/features/chat/utils/groupMessagesByDate";
import { UserAvatar } from "@/features/common/components/user-avatar";
import { ChatAnnouncement } from "./chat-announcement";
import { ChatMessageBubble } from "./chat-message-bubble";
import { ChatMessagesSkeleton } from "./chat-messages-skeleton";

export function ChatMessages() {
  return (
    <MessageScrollerProvider autoScroll defaultScrollPosition="end">
      <ChatMessageList />
    </MessageScrollerProvider>
  );
}

function ChatMessageList() {
  const { roomId, roomType, currentUserId } = useRoomContext();

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

  const dateGroups = groupMessagesByDate(messages);
  const lastMessageId = messages[messages.length - 1]?.id;

  return (
    <MessageScroller className="flex-1">
      <MessageScrollerViewport className="mask-none [webkit-mask-image:none]">
        <MessageScrollerContent className="gap-4 px-4 py-5">
          {isFetchingNextPage && (
            <div className="flex h-6 items-center justify-center">
              <Loader2Icon className="size-4 animate-spin text-muted-foreground" />
            </div>
          )}

          {dateGroups.length === 0 ? (
            <ChatEmptyState />
          ) : (
            dateGroups.map((dateGroup) => (
              <div key={dateGroup.dateLabel} className="flex flex-col gap-3">
                <Marker className="justify-center my-1">
                  <MarkerContent className="bg-muted px-2 py-1 rounded-full">
                    {dateGroup.dateLabel}
                  </MarkerContent>
                </Marker>
                {dateGroup.messages.map((message) => {
                  if (message.type === "announcement") {
                    return (
                      <MessageScrollerItem
                        key={message.id}
                        messageId={message.id}
                      >
                        <ChatAnnouncement message={message} />
                      </MessageScrollerItem>
                    );
                  }

                  const isMine = message.senderId === currentUserId;

                  return (
                    <MessageScrollerItem
                      key={message.id}
                      messageId={message.id}
                      scrollAnchor={isMine && message.id === lastMessageId}
                    >
                      <Message align={isMine ? "end" : "start"}>
                        {roomType === "group" && !isMine && (
                          <MessageAvatar className="mb-0.5">
                            <UserAvatar
                              name={message.sender?.name}
                              image={message.sender?.image}
                              className="size-7"
                            />
                          </MessageAvatar>
                        )}
                        <MessageContent>
                          {roomType === "group" &&
                            !isMine &&
                            message.sender?.name && (
                              <MessageHeader className="text-[11px]">
                                <span className="font-semibold text-foreground/90">
                                  {message.sender.name}
                                </span>
                              </MessageHeader>
                            )}
                          <ChatMessageBubble
                            message={message}
                            isMine={isMine}
                          />
                        </MessageContent>
                      </Message>
                    </MessageScrollerItem>
                  );
                })}
              </div>
            ))
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
