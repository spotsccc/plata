import { db } from "~/server/db";
import { User } from "./model";
import { users } from "~/server/db/schemas";

export async function getAllUsers(): Promise<Array<User>> {
  return db.query.users.findMany({ limit: 10 });
}

export async function insertUser(): Promise<User> {
  const inserResult = await db
    .insert(users)
    .values({
      email: "test@mail.ru",
      password: "password",
      username: "username",
    })
    .returning();

  return inserResult[0];
}
