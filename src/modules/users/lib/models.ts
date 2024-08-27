import type { UserSchema } from "../server/db/schemas";

export type UserWithPassword = Omit<UserSchema, "id"> & {
  id?: number;
};

export type User = Omit<UserWithPassword, "password">;
