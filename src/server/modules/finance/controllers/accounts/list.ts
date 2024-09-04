import { Context } from "~/server/context";
import { getAccounts } from "../../repository/account";
import { createSuccess } from "~/shared/result";

type Request = {
  ctx: Context;
};

export async function AccountsListPageController({ ctx }: Request) {
  const accounts = await getAccounts(ctx.user!.id!);

  return createSuccess({ accounts, user: ctx.user });
}
