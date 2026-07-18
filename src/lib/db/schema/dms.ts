import { relations } from "drizzle-orm";
import { index, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod";
import { rooms, user } from "./index";

export const dms = pgTable(
  "dms",
  {
    roomId: uuid("room_id")
      .primaryKey()
      .references(() => rooms.id, { onDelete: "cascade" }),
    user1Id: text("user1_id")
      .notNull()
      .references(() => user.id),
    user2Id: text("user2_id")
      .notNull()
      .references(() => user.id),
    dmKey: text("dm_key").notNull().unique(), // sorted `${min}-${max}` of user1Id/user2Id
  },
  (table) => [
    index("dms_user1_idx").on(table.user1Id),
    index("dms_user2_idx").on(table.user2Id),
    index("dms_dm_key_idx").on(table.dmKey),
  ],
);

export const dmsRelations = relations(dms, ({ one }) => ({
  room: one(rooms, {
    fields: [dms.roomId],
    references: [rooms.id],
  }),
  user1: one(user, {
    fields: [dms.user1Id],
    references: [user.id],
    relationName: "user1",
  }),
  user2: one(user, {
    fields: [dms.user2Id],
    references: [user.id],
    relationName: "user2",
  }),
}));

export const insertDmSchema = createInsertSchema(dms);
export const selectDmSchema = createSelectSchema(dms);

export type Dm = z.infer<typeof selectDmSchema>;
export type NewDm = z.infer<typeof insertDmSchema>;
