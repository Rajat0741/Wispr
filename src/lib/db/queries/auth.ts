import { ilike } from "drizzle-orm";
import { db } from "@/lib/db";
import { user } from "@/lib/db/schema";

export const searchUsersByUsername = async (
  query: string,
  limit: number = 20,
) => {
  const users = await db
    .select({
      id: user.id,
      username: user.username,
      displayUsername: user.displayUsername,
      name: user.name,
      image: user.image,
    })
    .from(user)
    .where(ilike(user.username, `%${query}%`))
    .limit(limit);
  return users;
};
