import { relations } from "drizzle-orm";
import {
  type AnyPgColumn,
  index,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { user } from "./auth-schema";
import { rooms } from "./rooms";

export const messageTypeEnum = pgEnum("message_type", [
  "text",
  "image",
  "video",
  "audio",
  "file",
  "ai",
]);
export const messageTypeSchema = z.enum(messageTypeEnum.enumValues);

export const messages = pgTable(
  "messages",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    roomId: uuid("room_id")
      .notNull()
      .references(() => rooms.id, { onDelete: "cascade" }),
    senderId: text("sender_id")
      .notNull()
      .references(() => user.id),
    type: messageTypeEnum("type").notNull(),
    content: text("content").notNull(),
    replyTo: uuid("reply_to").references((): AnyPgColumn => messages.id, {
      onDelete: "set null",
    }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("messages_room_created_idx").on(table.roomId, table.createdAt),
  ],
);

// ---- relations ----

export const messagesRelations = relations(messages, ({ one, many }) => ({
  room: one(rooms, { fields: [messages.roomId], references: [rooms.id] }),
  sender: one(user, { fields: [messages.senderId], references: [user.id] }),
  replyTo: one(messages, {
    fields: [messages.replyTo],
    references: [messages.id],
    relationName: "messageReply",
  }),

  replies: many(messages, {
    relationName: "messageReply",
  }),
}));

// ---- zod schemas ----

export const insertMessageSchema = createInsertSchema(messages, {
  content: z.string().min(1).max(10000),
});
export const selectMessageSchema = createSelectSchema(messages);

// ---- convenience types ----

export type MessageType = z.infer<typeof selectMessageSchema>;
export type NewMessage = z.infer<typeof insertMessageSchema>;
