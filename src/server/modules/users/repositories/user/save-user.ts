import { db } from "~/server/db";
import { User, UserWithPassword } from "../../models/user";
import { users } from "../../schemas/user";

export async function saveUser(user: UserWithPassword): Promise<User> {
  const inserResult = await db
    .insert(users)
    .values(user)
    .onConflictDoUpdate({ target: users.id, set: user })
    .returning();

  return inserResult[0];
}
