"use client";

import { ArrowDownIcon, Loader2Icon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
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
  useMessageScroller,
  useMessageScrollerScrollable,
} from "@/components/ui/message-scroller";
import { useChatStore } from "@/features/chat/components/layout/chat-provider";
import { useMessages } from "@/features/chat/queries/useMessages";
import type { MessageWithSender } from "@/features/chat/types";
import { groupMessagesByDate } from "@/features/chat/utils/groupMessagesByDate";
import { UserAvatar } from "@/features/common/components/user-avatar";
import { cn } from "@/lib/utils";
import { ReplyTargetPanel } from "../panels/reply-target-panel";
import { ChatMessagesSkeleton } from "../skeletons/chat-messages-skeleton";
import { ChatAnnouncement } from "./chat-announcement";
import { ChatMessageBubble } from "./chat-message-bubble";
import { ChatMessageContextMenu } from "./chat-message-context-menu";

export function ChatMessages() {
  return (
    <MessageScrollerProvider autoScroll defaultScrollPosition="end">
      <ChatMessageList />
    </MessageScrollerProvider>
  );
}

function ChatMessageList() {
  const roomId = useChatStore((s) => s.roomId);
  const roomType = useChatStore((s) => s.roomType);
  const currentUserId = useChatStore((s) => s.currentUserId);

  const {
    messages,
    isPending,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = useMessages(roomId);

  const { scrollToMessage } = useMessageScroller();
  const { start } = useMessageScrollerScrollable();
  const [highlightedMessageId, setHighlightedMessageId] = useState<
    string | null
  >(null);

  type ReplyTarget = NonNullable<MessageWithSender["replyToMessage"]>;
  const [replyTargetPanel, setReplyTargetPanel] = useState<ReplyTarget | null>(
    null,
  );

  const highlightTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!start && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [start, hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(
    () => () => {
      if (highlightTimer.current) clearTimeout(highlightTimer.current);
    },
    [],
  );

  const highlightMessage = (messageId: string) => {
    setHighlightedMessageId(messageId);
    if (highlightTimer.current) clearTimeout(highlightTimer.current);
    highlightTimer.current = setTimeout(() => {
      setHighlightedMessageId(null);
    }, 1500);
  };

  const handleReplyTargetClick = (
    replyTarget: NonNullable<MessageWithSender["replyToMessage"]>,
  ) => {
    const scrolled = scrollToMessage(replyTarget.id, {
      behavior: "smooth",
      align: "center",
    });

    if (scrolled) {
      highlightMessage(replyTarget.id);
    } else {
      setReplyTargetPanel(replyTarget);
    }
  };

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
                      className={cn(
                        "rounded-lg transition-colors",
                        highlightedMessageId === message.id &&
                          "bg-primary/10 ring-2 ring-primary/40",
                      )}
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
                          <ChatMessageContextMenu message={message}>
                            <ChatMessageBubble
                              message={message}
                              isMine={isMine}
                              onReplyTargetClick={handleReplyTargetClick}
                            />
                          </ChatMessageContextMenu>
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
      <ReplyTargetPanel
        replyTarget={replyTargetPanel}
        onOpenChange={(open) => {
          if (!open) setReplyTargetPanel(null);
        }}
      />
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
