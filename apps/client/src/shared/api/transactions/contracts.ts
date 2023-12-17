import { Literal, Record, Number, Intersect, String, Union } from "runtypes"

export const MoneyContract = Record({
  amount: Number,
  accuracy: Number,
  currency: Record({
    code: String,
  }),
})

export const BaseTransactionContract = Record({
  id: Number,
  date: String,
  value: MoneyContract,
})

export const IncomeTransactionContract = Intersect(
  BaseTransactionContract,
  Record({
    type: Literal("income"),
  }),
)

export const ExchangeTransactionContract = Intersect(
  BaseTransactionContract,
  Record({
    type: Literal("exchange"),
    exchange: MoneyContract,
  }),
)

export const ExpenseTransactionContract = Intersect(
  BaseTransactionContract,
  Record({
    type: Literal("expense"),
    category: String,
  }),
)

export const TransactionContract = Union(
  IncomeTransactionContract,
  ExchangeTransactionContract,
  ExpenseTransactionContract,
)
