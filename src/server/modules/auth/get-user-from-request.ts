import { User } from "../user";
import { db } from "~/server/db";

export async function getUserFromRequest(req: {
  cookies: Partial<{
    [key: string]: string;
  }>;
}): Promise<User | null> {
  const accessToken = req.cookies["accessToken"];
  console.log(accessToken);

  if (!accessToken) {
    return null;
  }

  const user = await getUserByAccessToken(accessToken as string);

  return user;
}

export async function getUserByAccessToken(
  accessToken: string,
): Promise<User | null> {
  const tokenWithUser = await db.query.accessTokens.findFirst({
    where: ({ token }, { eq }) => eq(token, accessToken),
    with: {
      user: true,
    },
  });

  if (!tokenWithUser) {
    return null;
  }

  return tokenWithUser.user;
}
