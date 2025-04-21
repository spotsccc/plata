import {
  action,
  atom,
  computed,
  isCausedBy,
  withComputed,
  wrap,
} from "@reatom/core";
import { createAccount } from "../accounts/model";
import { z } from "zod";

const nameSchema = z.string().min(1);
const currencySchema = z.string().min(3);

export const $finished = atom(false);

export const $accountName = atom("");
export const $accountNameError = atom<string | null>(null).extend(
  withComputed((state) => {
    $accountName();

    if (isCausedBy($accountName)) {
      return null;
    }
    // @ts-ignore
    return state[0] as string | null;
  })
);

export const $accountCurrency = atom("");
export const $accountCurrencyError = atom<string | null>(null).extend(
  withComputed((state) => {
    $accountCurrency();
    if (isCausedBy($accountCurrency)) {
      return null;
    }
    // @ts-ignore
    return state[0] as string | null;
  })
);

export const submit = action(async () => {
  const name = $accountName();
  const currency = $accountCurrency();

  const nameResult = nameSchema.safeParse(name);
  if (!nameResult.success) {
    $accountNameError(
      nameResult.error.issues.reduce((acc, issue) => {
        if (!acc) {
          return issue.message;
        }
        return `${acc}\n ${issue.message}`;
      }, "")
    );
    return;
  }
  const currencyResult = currencySchema.safeParse(currency);
  if (!currencyResult.success) {
    $accountCurrencyError(
      currencyResult.error.issues.reduce((acc, issue) => {
        if (!acc) {
          return issue.message;
        }
        return `${acc}\n ${issue.message}`;
      }, "")
    );
    return;
  }

  await wrap(
    createAccount({
      name,
      defaultCurrency: currency,
      balance: {
        [currency]: {
          amount: "0",
          currency,
          accuracy: 2,
        },
      },
    })
  );

  $finished(true);
});

export const $error = computed(() => {
  return createAccount.error();
});

export const $loading = computed(() => {
  return createAccount.pending() > 0;
});
