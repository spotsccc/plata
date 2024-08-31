import { Money } from "./money";

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
