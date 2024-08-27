import { db } from "~/server/db";
import { accessTokens } from "./schemas";
import dayjs from "dayjs";
import type { AccessToken } from "../../lib/models";

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
