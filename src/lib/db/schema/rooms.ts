import { relations, sql } from "drizzle-orm";
import {
  check,
  index,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { user } from "./index";

export const roomRoleEnum = pgEnum("room_role", ["admin", "member"]);
export const roomTypeEnum = pgEnum("room_type", ["dm", "group"]);

export const rooms = pgTable(
  "rooms",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    roomType: roomTypeEnum("room_type").notNull(),
    // Canonical sorted pair "userIdSmaller:userIdLarger" — NULL for groups.
    // Used only for enforcing one DM per user pair at the DB level.
    dmKey: text("dm_key"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    // DMs must carry a dmKey.
    check(
      "dm_requires_key",
      sql`${table.roomType} <> 'dm' OR ${table.dmKey} IS NOT NULL`,
    ),
    // Groups must NOT carry a dmKey.
    check(
      "group_no_dm_key",
      sql`${table.roomType} <> 'group' OR ${table.dmKey} IS NULL`,
    ),
    // One DM per user pair.
    uniqueIndex("rooms_unique_dm")
      .on(table.dmKey)
      .where(sql`room_type = 'dm'`),
  ],
);

export const groupInfo = pgTable(
  "group_info",
  {
    roomId: uuid("room_id")
      .primaryKey()
      .references(() => rooms.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 100 }).notNull(),
    createdBy: text("created_by")
      .notNull()
      .references(() => user.id),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [index("idx_group_info_created_by").on(table.createdBy)],
);

export const roomMembers = pgTable(
  "room_members",
  {
    roomId: uuid("room_id")
      .notNull()
      .references(() => rooms.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id),
    role: roomRoleEnum("role").notNull().default("member"),
    joinedAt: timestamp("joined_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    primaryKey({ columns: [table.roomId, table.userId] }),
    // Critical: every "get all rooms for user" query hits this.
    index("idx_room_members_user").on(table.userId),
  ],
);

// ---- relations ----

export const roomsRelations = relations(rooms, ({ one, many }) => ({
  groupInfo: one(groupInfo, {
    fields: [rooms.id],
    references: [groupInfo.roomId],
  }),
  members: many(roomMembers),
}));

export const groupInfoRelations = relations(groupInfo, ({ one }) => ({
  room: one(rooms, { fields: [groupInfo.roomId], references: [rooms.id] }),
  createdByUser: one(user, {
    fields: [groupInfo.createdBy],
    references: [user.id],
  }),
}));

export const roomMembersRelations = relations(roomMembers, ({ one }) => ({
  room: one(rooms, { fields: [roomMembers.roomId], references: [rooms.id] }),
  user: one(user, { fields: [roomMembers.userId], references: [user.id] }),
}));

// ---- zod schemas ----

export const insertRoomSchema = createInsertSchema(rooms, {
  // dmKey is computed by the application layer, not passed raw by clients.
  dmKey: z.string().max(201).optional(),
});
export const selectRoomSchema = createSelectSchema(rooms);

export const insertGroupInfoSchema = createInsertSchema(groupInfo, {
  name: z.string().min(1).max(100),
});
export const selectGroupInfoSchema = createSelectSchema(groupInfo);

export const insertRoomMemberSchema = createInsertSchema(roomMembers);
export const selectRoomMemberSchema = createSelectSchema(roomMembers);

// ---- convenience types ----

export type Room = z.infer<typeof selectRoomSchema>;
export type NewRoom = z.infer<typeof insertRoomSchema>;
export type GroupInfo = z.infer<typeof selectGroupInfoSchema>;
export type NewGroupInfo = z.infer<typeof insertGroupInfoSchema>;
export type RoomMember = z.infer<typeof selectRoomMemberSchema>;
