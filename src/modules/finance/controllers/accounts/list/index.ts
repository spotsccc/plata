import dayjs from "dayjs";
import { GetServerSidePropsContext } from "next";
import { getAccounts } from "~/modules/finance/database/get-accounts";
import { initConfig } from "~/server/config";
import { db, initializeDatabase } from "~/server/db";
import { createError, createSuccess, isError } from "~/shared/result";

initConfig();
initializeDatabase();

export async function authGuard(req: GetServerSidePropsContext["req"]) {
  const token = req.cookies["accessToken"];

  if (!token) {
    return createError({ type: "unauthorized", reason: "token-not-found" });
  }

  const tokenWithUser = await db.query.accessTokens.findFirst({
    where: (accessTokens, { eq }) => eq(accessTokens.token, token),
    with: {
      user: true,
    },
  });

  if (!tokenWithUser) {
    return createError({
      type: "unauthorized" as const,
      reason: "token-not-found",
    });
  }

  if (!tokenWithUser || !dayjs().isBefore(tokenWithUser.expiresAt)) {
    return createError({ type: "unauthorized", reason: "token-expired" });
  }

  return createSuccess({ user: tokenWithUser.user });
}

export async function AccountsListController(
  req: GetServerSidePropsContext["req"],
) {
  const auth = await authGuard(req);

  if (isError(auth)) {
    return auth;
  }

  const accounts = await getAccounts(auth.success.user.id!);

  return createSuccess({ accounts, user: auth.success.user });
}
