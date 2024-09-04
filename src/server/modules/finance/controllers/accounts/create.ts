import { z } from "zod";
import { Context } from "~/server/context";
import { createAccount } from "../../models/account";
import { saveAccount } from "../../repository/account";
import { Currency } from "../../models/money";

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
