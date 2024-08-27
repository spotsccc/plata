import { hash } from "crypto";
import { UserWithPassword } from "~/modules/users/lib/models";

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
