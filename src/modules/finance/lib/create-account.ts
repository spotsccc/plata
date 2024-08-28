import { Account, Currency, Money } from "./model";

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
