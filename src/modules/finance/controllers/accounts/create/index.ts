import { saveAccount } from "~/modules/finance/database/save-account";
import { createAccount } from "~/modules/finance/lib/create-account";
import { accountCreateInput } from "~/modules/finance/lib/inputs";
import { authProcedure } from "~/server/trpc";

export const create = authProcedure
  .input(accountCreateInput)
  .mutation(async ({ ctx, input }) => {
    let account = createAccount({ ...input, userId: ctx.user?.id! });
    account = await saveAccount(account);

    return account;
  });
