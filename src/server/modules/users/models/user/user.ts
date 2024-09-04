import { hash } from "crypto";
import { UserSchema } from "../../schemas/user";

export type UserWithPassword = Omit<UserSchema, "id"> & {
  id?: number;
};

export type User = Omit<UserWithPassword, "password">;

export function createUser({
  username,
  password,
  email,
}: {
  username: string;
  password: string;
  email: string;
}): UserWithPassword {
  return {
    username,
    password: hash("sha256", password),
    email,
  };
}
