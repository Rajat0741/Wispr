import { and, eq, ilike, notInArray } from "drizzle-orm";
import { db, type TransactionScope } from "@/lib/db";
import { user } from "@/lib/db/schema";

export const searchUsersByUsername = async ({
  query,
  excludedUserIds,
  limit = 10,
  executor = db,
}: {
  query: string;
  excludedUserIds: string[];
  limit?: number;
  executor?: TransactionScope;
}) => {
  const users = await executor
    .select({
      id: user.id,
      username: user.username,
      name: user.name,
      image: user.image,
      bio: user.bio,
    })
    .from(user)
    .where(
      and(
        ilike(user.username, `%${query}%`),
        notInArray(user.id, excludedUserIds),
      ),
    )
    .limit(limit);

  return users;
};

export const getUserByUsername = async (
  username: string,
  executor: TransactionScope = db,
) => {
  const [foundUser] = await executor
    .select({
      id: user.id,
      name: user.name,
      username: user.username,
      displayUsername: user.displayUsername,
      image: user.image,
      bio: user.bio,
      lastActiveAt: user.lastActiveAt,
    })
    .from(user)
    .where(ilike(user.username, username))
    .limit(1);

  return foundUser ?? null;
};

export const getUserById = async (
  id: string,
  executor: TransactionScope = db,
) => {
  const [foundUser] = await executor
    .select({
      id: user.id,
      name: user.name,
      username: user.username,
      displayUsername: user.displayUsername,
      image: user.image,
      bio: user.bio,
      lastActiveAt: user.lastActiveAt,
    })
    .from(user)
    .where(eq(user.id, id))
    .limit(1);

  return foundUser ?? null;
};
