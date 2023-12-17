import { AccountId } from "../account"
import { Money } from "../money"
import { SubAccountId } from "../sub-account"

export type Transaction =
  | TransactionIncome
  | TransactionExpense
  | TransactionExchange

export type TransactionId = string

export type BaseTransaction = {
  value: Money
  id: string
  creationDate: string
  subAccountId: SubAccountId
}

export type TransactionIncome = {
  type: TransactionType.income
} & BaseTransaction
export type TransactionExpense = {
  type: TransactionType.expense
  category: BaseCategories
} & BaseTransaction
export type TransactionExchange = {
  type: TransactionType.exchange
  exchange: Money
  exchangeReceiver: AccountId
} & BaseTransaction

export enum TransactionType {
  income = "income",
  expense = "expense",
  exchange = "exchange",
}

export enum BaseCategories {
  cloth = "cloth",
  sport = "sport",
  food = "food",
  restaurant = "restaurant",
  travel = "travel",
  education = "education",
  medicine = "medicine",
  rent = "rent",
  leisure = "leisure",
  vape = "vape",
  cigaretes = "cigaretes",
}
