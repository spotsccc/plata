import { MoneySchema } from "../money"
import { BaseCategories, TransactionType } from "./model"
import { object, string, literal, discriminatedUnion, nativeEnum } from "zod"

export const CategorySchema = nativeEnum(BaseCategories)

export const TransactionBaseSchema = object({
  value: MoneySchema,
  creationDate: string().datetime("Date should be ISO string"),
  id: string().uuid(),
  subAccountId: string().uuid(),
})

export const TransactionIncomeSchema = TransactionBaseSchema.extend({
  type: literal(TransactionType.income, {
    invalid_type_error: "Type should be income",
  }),
})

export const TransactionExpenseSchema = TransactionBaseSchema.extend({
  type: literal(TransactionType.expense),
  category: CategorySchema,
})

export const TransactionExchangeSchema = TransactionBaseSchema.extend({
  type: literal(TransactionType.exchange, {
    invalid_type_error: "Type should be exchange",
  }),
  exchangeReceiver: string().uuid(),
  exchange: MoneySchema,
})

export const TransactionSchema = discriminatedUnion("type", [
  TransactionExchangeSchema,
  TransactionIncomeSchema,
  TransactionExpenseSchema,
])
