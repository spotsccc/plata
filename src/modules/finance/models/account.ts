import type { AccountSchema } from "../schemas/accounts";
import { Currency, Money } from "./money";

export type Account = Omit<
  AccountSchema,
  "id" | "balance" | "defaultCurrency"
> & {
  id?: number;
  balance: Record<Currency, Money>;
  defaultCurrency: Currency;
};

export function createAccount({
  name,
  userId,
  defaultCurrency,
}: {
  name: string;
  userId: number;
  defaultCurrency: Currency;
}): Account {
  const balance = {
    [defaultCurrency]: {
      amount: BigInt(0),
      currency: defaultCurrency,
      accuracy: 0,
    },
  } as unknown as Record<Currency, Money>;

  return {
    name,
    userId,
    balance,
    defaultCurrency,
  };
}
