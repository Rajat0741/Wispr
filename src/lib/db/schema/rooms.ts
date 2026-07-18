import { relations } from "drizzle-orm";
import {
  index,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod";
import { user } from "./auth-schema";
import { dms } from "./dms";
import { groups } from "./groups";
import { messages } from "./messages";

export const roomRoleEnum = pgEnum("room_role", ["admin", "member"]);
export const roomTypeEnum = pgEnum("room_type", ["dm", "group"]);

export const rooms = pgTable("rooms", {
  id: uuid("id").primaryKey().defaultRandom(),
  roomType: roomTypeEnum("room_type").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const roomMembers = pgTable(
  "room_members",
  {
    roomId: uuid("room_id")
      .notNull()
      .references(() => rooms.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id),
    role: roomRoleEnum("role").default("member"),
  },
  (table) => [
    primaryKey({ columns: [table.roomId, table.userId] }),
    index("room_members_user_idx").on(table.userId),
  ],
);

// ---- relations ----

export const roomsRelations = relations(rooms, ({ one, many }) => ({
  members: many(roomMembers),
  messages: many(messages),
  dm: one(dms),
  group: one(groups),
}));

export const roomMembersRelations = relations(roomMembers, ({ one }) => ({
  room: one(rooms, {
    fields: [roomMembers.roomId],
    references: [rooms.id],
  }),
  user: one(user, {
    fields: [roomMembers.userId],
    references: [user.id],
  }),
}));

// ---- zod schemas ----

export const insertRoomSchema = createInsertSchema(rooms);
export const selectRoomSchema = createSelectSchema(rooms);

export const insertRoomMemberSchema = createInsertSchema(roomMembers);
export const selectRoomMemberSchema = createSelectSchema(roomMembers);

// ---- convenience types ----

export type Room = z.infer<typeof selectRoomSchema>;
export type NewRoom = z.infer<typeof insertRoomSchema>;
export type RoomMember = z.infer<typeof selectRoomMemberSchema>;
export type NewRoomMember = z.infer<typeof insertRoomMemberSchema>;
