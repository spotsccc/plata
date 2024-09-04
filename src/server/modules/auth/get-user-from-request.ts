import { User } from "../users/models/user";
import { getUserByAccessToken } from "../users/repositories/user";

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
