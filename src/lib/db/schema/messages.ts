import { relations, sql } from "drizzle-orm";
import {
  type AnyPgColumn,
  bigserial,
  boolean,
  check,
  index,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
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
  "announcement",
]);
export const messageTypeSchema = z.enum(messageTypeEnum.enumValues);

export const messages = pgTable(
  "messages",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    displayOrder: bigserial("display_order", { mode: "number" }).notNull(),
    roomId: uuid("room_id")
      .notNull()
      .references(() => rooms.id, { onDelete: "cascade" }),
    senderId: text("sender_id").references(() => user.id),
    type: messageTypeEnum("type").notNull(),
    content: text("content").notNull(),
    isDeleted: boolean("is_deleted").default(false).notNull(),
    replyTo: uuid("reply_to"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("messages_room_created_idx").on(table.roomId, table.createdAt),
    uniqueIndex("messages_room_display_order_unique_idx").on(
      table.roomId,
      table.displayOrder,
    ),
    check(
      "messages_sender_or_type_check",
      sql`"sender_id" IS NOT NULL OR "type" IN ('ai', 'announcement')`,
    ),
  ],
);

// ---- relations ----

export const messagesRelations = relations(messages, ({ one, many }) => ({
  room: one(rooms, { fields: [messages.roomId], references: [rooms.id] }),
  sender: one(user, { fields: [messages.senderId], references: [user.id] }),
  replyToMessage: one(messages, {
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
