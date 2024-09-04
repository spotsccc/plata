import { createEvent, sample } from "effector";
import { $amount, reinit as reinitAmount } from "./amount";
import { $currency, reinit as reinitCurrency } from "./currency";
import { $account, $type, reinit as reinitCore } from "./core";
import { transactionCreateMutation } from "../api";
import { TransactionCreateInput } from "~/server/modules/finance/controllers/transactions/create";
import { navigateToBackUrl } from "./navigation";

export const creationSubmitted = createEvent();

export const $loading = transactionCreateMutation.$pending;

sample({
  clock: creationSubmitted,
  source: {
    amount: $amount,
    currency: $currency,
    account: $account,
    type: $type,
  },
  fn({ account, currency, amount, type }) {
    const { amount: formattedAmount, accuracy } = formatAmount(amount);

    return {
      accountId: account?.id!,
      currency: currency!,
      amount: formattedAmount,
      accuracy: accuracy,
      type,
      createdAt: new Date().toISOString(),
    } as TransactionCreateInput;
  },
  target: transactionCreateMutation.start,
});

sample({
  clock: transactionCreateMutation.finished.success,
  target: [navigateToBackUrl],
});

sample({
  clock: navigateToBackUrl,
  target: [reinitAmount, reinitCurrency, reinitCore],
});

export function formatAmount(amount: string) {
  const indexOfPoint =
    amount.indexOf(".") === -1 ? amount.length : amount.indexOf(".");

  const formattedAmount = amount.replace(".", "");
  const accuracy = amount.length - indexOfPoint;

  return {
    accuracy,
    amount: trimLeftZeroes(formattedAmount),
  };
}

export function trimLeftZeroes(integerPart: string) {
  let i = 0;
  for (; i < integerPart.length; i++) {
    if (integerPart[i] !== "0") {
      break;
    }
  }

  if (i === integerPart.length) {
    return "0";
  }

  return integerPart.slice(i);
}
