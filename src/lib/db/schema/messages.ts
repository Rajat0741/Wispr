import { relations } from "drizzle-orm";
import { index, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { user } from "./index";
import { rooms } from "./rooms";

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
    content: text("content").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("idx_messages_room").on(table.roomId, table.createdAt),
    index("idx_messages_sender").on(table.senderId),
  ],
);

// ---- relations ----

export const messagesRelations = relations(messages, ({ one }) => ({
  room: one(rooms, { fields: [messages.roomId], references: [rooms.id] }),
  sender: one(user, { fields: [messages.senderId], references: [user.id] }),
}));

// ---- zod schemas ----

export const insertMessageSchema = createInsertSchema(messages, {
  content: z.string().min(1).max(4000),
});
export const selectMessageSchema = createSelectSchema(messages);

// ---- convenience types ----

export type Message = z.infer<typeof selectMessageSchema>;
export type NewMessage = z.infer<typeof insertMessageSchema>;
