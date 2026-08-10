import { eq, ilike } from "drizzle-orm";
import { db } from "@/lib/db";
import { user } from "@/lib/db/schema";

export const searchUsersByUsername = async (
  query: string,
  limit: number = 10,
) => {
  const users = await db
    .select({
      id: user.id,
      username: user.username,
      name: user.name,
      image: user.image,
      bio: user.bio,
    })
    .from(user)
    .where(ilike(user.username, `%${query}%`))
    .limit(limit);
  return users;
};

export const getUserById = async (id: string) => {
  const [foundUser] = await db
    .select({
      id: user.id,
      username: user.username,
      name: user.name,
      image: user.image,
      bio: user.bio,
    })
    .from(user)
    .where(eq(user.id, id))
    .limit(1);

  return foundUser ?? null;
};
