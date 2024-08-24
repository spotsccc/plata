import dayjs from "dayjs";
import { db, initializeDatabase } from "~/server/db";
import { User } from "~/server/modules/user";
import { GetServerSidePropsContext } from "next";
import { initConfig } from "~/server/config";

initConfig();
initializeDatabase();

export type MainPageResponse =
  | {
      tag: "unauthorized";
      reason: string;
    }
  | {
      tag: "success";
      data: {
        message: string;
      };
    };

export async function mainPageController(
  req: GetServerSidePropsContext["req"],
): Promise<MainPageResponse> {
  const auth = await authGuard(req);

  if (auth.tag === "unauthorized") {
    return auth;
  }

  return {
    tag: "success",
    data: {
      message: "Hello from server",
    },
  };
}

export type AuthResult =
  | {
      tag: "unauthorized";
      reason: string;
    }
  | { tag: "authorized"; user: User };

export async function authGuard(
  req: GetServerSidePropsContext["req"],
): Promise<AuthResult> {
  const token = req.cookies["accessToken"];

  if (!token) {
    return { tag: "unauthorized" as const, reason: "no-token" };
  }

  const tokenWithUser = await db.query.accessTokens.findFirst({
    where: (accessTokens, { eq }) => eq(accessTokens.token, token),
    with: {
      user: true,
    },
  });

  if (!tokenWithUser) {
    return { tag: "unauthorized" as const, reason: "token-not-found" };
  }

  if (!tokenWithUser || !dayjs().isBefore(tokenWithUser.expiresAt)) {
    return { tag: "unauthorized" as const, reason: "token-expired" };
  }

  return { tag: "authorized" as const, user: tokenWithUser.user };
}
