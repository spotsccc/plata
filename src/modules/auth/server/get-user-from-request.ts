import { User } from "~/modules/users/lib/models";
import { getUserByAccessToken } from "./db/get-user-by-access-token";

export async function getUserFromRequest(req: {
  cookies: Partial<{
    [key: string]: string;
  }>;
}): Promise<User | null> {
  const accessToken = req.cookies["accessToken"];

  if (!accessToken) {
    return null;
  }

  const user = await getUserByAccessToken(accessToken as string);

  return user;
}
