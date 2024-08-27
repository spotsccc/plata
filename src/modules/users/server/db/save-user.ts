import { db } from "~/server/db";
import { users } from "./schemas";
import { User, UserWithPassword } from "../../lib/models";

export async function saveUser(user: UserWithPassword): Promise<User> {
  const inserResult = await db
    .insert(users)
    .values(user)
    .onConflictDoUpdate({ target: users.id, set: user })
    .returning();

  return inserResult[0];
}
