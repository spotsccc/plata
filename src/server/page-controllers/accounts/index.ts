import { GetServerSidePropsContext } from "next";
import { authGuard } from "../main";
import { db } from "~/server/db";

export async function AccountsListController(
  req: GetServerSidePropsContext["req"],
) {
  const auth = await authGuard(req);

  if (auth.tag === "unauthorized") {
    return auth;
  }

  const accounts = await db.query.accounts.findMany({
    where: (account, { eq }) => eq(account.userId, auth.user.id),
  });

  return {
    tag: "success" as const,
    data: {
      accounts,
      user: auth.user,
    },
  };
}
