import { format } from "date-fns";
import { ArrowDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";
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
} from "@/components/ui/message-scroller";
import { UserAvatar } from "@/features/common/components/user-avatar";
import type { MessageType } from "@/lib/db/schema";
import type { User } from "@/types/user";

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
  const memberById = new Map(members.map((member) => [member.id, member]));
  const groupedMessages = groupMessages(messages);

  if (!groupedMessages || groupedMessages.length === 0) {
    return (
      <ChatMessageListContainer>
        <ChatEmptyState />
      </ChatMessageListContainer>
    );
  }

  return (
    <ChatMessageListContainer>
      {groupedMessages.map((group) => {
        const sender = memberById.get(group[0].senderId);
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
                    <MessageAvatar className={cn(i !== lastInGroup && "invisible")}>
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
                      <BubbleContent className="whitespace-pre-wrap">
                        {message.content}
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
      })}
    </ChatMessageListContainer>
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

function ChatMessageListContainer({ children }: { children: React.ReactNode }) {
  return (
    <MessageScrollerProvider autoScroll defaultScrollPosition="end">
      <MessageScroller className="flex-1">
        <MessageScrollerViewport className="mask-none [webkit-mask-image:none]">
          <MessageScrollerContent className="gap-4 px-4 py-5">
            {children}
          </MessageScrollerContent>
        </MessageScrollerViewport>
        <MessageScrollerButton
          size="icon"
          className="left-auto right-8 size-10 rounded-full shadow-md border border-border bg-background text-foreground hover:bg-muted z-20"
        >
          <ArrowDownIcon className="size-5" />
          <span className="sr-only">Scroll to bottom</span>
        </MessageScrollerButton>
      </MessageScroller>
    </MessageScrollerProvider>
  );
}
