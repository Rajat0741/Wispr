import { relations } from "drizzle-orm";
import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod";
import { rooms, user } from "./index";

export const groups = pgTable("groups", {
  roomId: uuid("room_id")
    .primaryKey()
    .references(() => rooms.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  groupImage: text("group_image"),
  createdBy: text("created_by")
    .notNull()
    .references(() => user.id),
});

export const groupsRelations = relations(groups, ({ one }) => ({
  room: one(rooms, {
    fields: [groups.roomId],
    references: [rooms.id],
  }),
  createdByUser: one(user, {
    fields: [groups.createdBy],
    references: [user.id],
    relationName: "createdBy",
  }),
}));

export const insertGroupSchema = createInsertSchema(groups);
export const selectGroupSchema = createSelectSchema(groups);

export type Group = z.infer<typeof selectGroupSchema>;
export type NewGroup = z.infer<typeof insertGroupSchema>;
