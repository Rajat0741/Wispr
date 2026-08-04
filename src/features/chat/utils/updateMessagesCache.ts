import type { InfiniteData } from "@tanstack/react-query";
import type { MessageWithSender } from "@/features/chat/types";

export interface MessagesPage {
  messages: MessageWithSender[];
  nextCursor: number | null;
}

export function updateMessagesCache(
  cachedData: InfiniteData<MessagesPage> | undefined,
  payload: MessageWithSender,
): InfiniteData<MessagesPage> | undefined {

  if (!cachedData?.pages?.length) return cachedData;

  let exists = false;
  const updatedPages = cachedData.pages.map((page) => {
    const updatedPage = upsertMessage(page, payload);
    if (updatedPage !== page) exists = true;
    return updatedPage;
  });

  if (!exists) {
    updatedPages[0] = {
      ...updatedPages[0],
      messages: [payload, ...updatedPages[0].messages],
    };
  }

  return {
    ...cachedData,
    pages: updatedPages
  }

}

function upsertMessage(page: MessagesPage, newMessage: MessageWithSender): MessagesPage {
  const index = page.messages.findIndex((message) => message.id === newMessage.id);

  if (index !== -1) {
    const messages = page.messages.slice();
    messages[index] = newMessage;
    return { ...page, messages };
  }

  return page;
}
