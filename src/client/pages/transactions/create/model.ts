import { createEvent, sample } from "effector";
import { init, Step } from "~/client/features/transaction/create/model";
import { Account } from "~/server/modules/finance/models/account";
import { Currency } from "~/server/modules/finance/models/money";
import { TransactionType } from "~/server/modules/finance/models/transaction";
import { User } from "~/server/modules/users/models/user";
import { isSuccess, Result, Success } from "~/shared/result";

export const pageStarted = createEvent<
  Result<
    {
      account: Account;
      user: User;
      type?: TransactionType;
      step?: Step;
      currency?: Currency;
      backUrl?: string;
    },
    unknown
  >
>();

sample({
  clock: pageStarted,
  filter: isSuccess,
  fn: (
    res: Success<{
      account: Account;
      user: User;
      type?: TransactionType;
      step?: Step;
      currency?: Currency;
      backUrl?: string;
    }>,
  ) => ({
    account: res.success.account,
    type: res.success.type,
    step: res.success.step,
    currency: res.success.currency,
    backUrl: res.success.backUrl,
  }),
  target: init,
});