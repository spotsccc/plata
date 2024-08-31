import { createEvent, restore, sample } from "effector";
import { createAccountMutation } from "./api";
import type { Currency } from "~/modules/finance/models/money";
import type { AccountCreateInput } from "~/modules/finance/controllers/accounts/create";

export const submitted = createEvent();
export const nameChanged = createEvent<string>();
export const currencyChanged = createEvent<Currency>();

export const $name = restore(nameChanged, "");
export const $currency = restore(currencyChanged, null);

sample({
  clock: submitted,
  source: {
    name: $name,
    defaultCurrency: $currency,
  },
  filter: (input): input is AccountCreateInput =>
    Boolean(input.defaultCurrency),
  target: createAccountMutation.start,
});
