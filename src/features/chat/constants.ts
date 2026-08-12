export const CHAT_EVENTS = {
  MESSAGE_UPDATES: "message_updates",
  CHAT_LIST_UPDATED: "chat_list_updated",
  ROOM_DATA_UPDATED: "room_data_updated",
} as const;

export const REALTIME_TOPICS = {
  room: (roomId: string) => `private:room:${roomId}`,
  chatList: (userId: string) => `private:chat-list:${userId}`,
} as const;

export const MESSAGE_UPDATES = CHAT_EVENTS.MESSAGE_UPDATES;
