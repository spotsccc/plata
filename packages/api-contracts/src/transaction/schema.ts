import {
  TransactionExchangeSchema,
  TransactionExpenseSchema,
  TransactionIncomeSchema,
  TransactionSchema,
} from "models"
import { discriminatedUnion, object } from "zod"

export const omittedKeys = { creationDate: true, id: true } as const

export const TransctionCreateRequestSchema = discriminatedUnion("type", [
  TransactionIncomeSchema.omit(omittedKeys),
  TransactionExpenseSchema.omit(omittedKeys),
  TransactionExchangeSchema.omit(omittedKeys),
])

export const TransactionCreateResponseSchema = object({
  transaction: TransactionSchema,
})
