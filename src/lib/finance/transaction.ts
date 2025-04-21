import { Money } from "./money";

export type TransactionType = "income" | "expense" | "transfer";

export type TransactionBase = {
  id: string;
  accountId: string;
  createdAt: Date;
  money: Money;
  description: string | null;
};

export type TransactionIncome = {
  type: "income";
} & TransactionBase;

export type TransactionExpense = {
  type: "expense";
  category: string;
} & TransactionBase;

export type TransactionTransfer = {
  type: "transfer";
  recepientId: string;
} & TransactionBase;

export type Transaction =
  | TransactionIncome
  | TransactionExpense
  | TransactionTransfer;
