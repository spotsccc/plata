import { User } from "~/modules/users/lib/models";
import { db } from "~/server/db";

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
