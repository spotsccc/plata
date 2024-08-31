import { saveAccount } from "~/modules/finance/repository/save-account";
import { z } from "zod";
import { Currency } from "~/shared/currencies";
import { createAccount } from "~/modules/finance/models/account";
import { Context } from "~/server/context";

export const accountCreateInput = z.object({
  name: z.string().min(1),
  defaultCurrency: z.nativeEnum(Currency),
});

export type AccountCreateInput = z.infer<typeof accountCreateInput>;

type Request = {
  ctx: Context;
  input: AccountCreateInput;
};

export async function accountCreateController({ ctx, input }: Request) {
  let account = createAccount({ ...input, userId: ctx.user?.id! });
  account = await saveAccount(account);

  return account;
}
