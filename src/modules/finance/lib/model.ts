import { AccountSchema } from "../database/schemas";

export type Money = {
  amount: string;
  accuracy: number;
  currency: Currency;
};

export enum Currency {
  BTC = "BTC",
  USD = "USD",
  USDT = "USDT",
  ARS = "ARS",
  RUB = "RUB",
  DOT = "DOT",
  ATOM = "ATOM",
  ETH = "ETH",
  FLOKI = "FLOKI",
  PEPE = "PEPE",
  W = "W",
  ARB = "ARB",
  HFT = "HFT",
  GLMR = "GLMR",
  XRP = "XRP",
  SOL = "SOL",
  DOGE = "DOGE",
  TRX = "TRX",
  ADA = "ADA",
  TON = "TON",
}

export enum TransactionType {
  income = "income",
  transfer = "transfer",
  expense = "expense",
}

export type TransactionBase = {
  id?: number;
  accountId: number;
  createdAt: Date;
  money: Money;
  description: string | null;
};

export type TransactionIncome = {
  type: TransactionType.income;
} & TransactionBase;

export type TransactionExpense = {
  type: TransactionType.expense;
  category: string;
} & TransactionBase;

export type TransactionTransfer = {
  type: TransactionType.transfer;
  receiverId: number;
  receiveMoney: Money;
} & TransactionBase;

export type Transaction =
  | TransactionIncome
  | TransactionExpense
  | TransactionTransfer;

export type Account = Omit<AccountSchema, "id" | "balance"> & {
  id?: number;
  balance: Record<Currency, Money>;
};
export function createEmptyMoney(currency: Currency): Money {
  return {
    amount: "0",
    accuracy: 0,
    currency,
  };
}
