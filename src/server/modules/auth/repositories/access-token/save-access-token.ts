import { db } from "~/server/db";
import dayjs from "dayjs";
import { accessTokens } from "../../schemas/access-tokens";
import { AccessToken } from "../../models/access-token";

export async function saveAccessToken(userId: number): Promise<AccessToken> {
  const accessToken = (
    await db
      .insert(accessTokens)
      .values({
        userId,
        expiresAt: dayjs().add(1, "d").toDate(),
      })
      .returning()
  )[0];

  return accessToken;
}
