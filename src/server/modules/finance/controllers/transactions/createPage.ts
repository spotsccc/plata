import { createError, createSuccess } from "~/shared/result";
import { getAccountById } from "../../repository/account";
import { Context } from "~/server/context";
import { z } from "zod";

export const transactionCreatePageInput = z.object({
  accountId: z.number(),
});

export type TransactionCreatePageInput = z.infer<
  typeof transactionCreatePageInput
>;

export type Request = {
  ctx: Context;
  input: TransactionCreatePageInput;
};

export async function transactionCreatePageController({ ctx, input }: Request) {
  const account = await getAccountById(input.accountId);

  if (!account) {
    return createError({ type: "Account does not exist" });
  }

  if (account.userId !== ctx.user?.id) {
    return createError({ type: "Access denied" });
  }

  return createSuccess({
    account,
    user: ctx.user!,
  });
}
