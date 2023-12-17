import { literal, number, object, string, union } from "zod"
import { CurrencyCode } from "./model"

export const CurrencyCodeSchema = union([
  literal(CurrencyCode.ARS),
  literal(CurrencyCode.BTC),
  literal(CurrencyCode.RUB),
  literal(CurrencyCode.USD),
  literal(CurrencyCode.USDT),
  literal(CurrencyCode.ETH),
  literal(CurrencyCode.GEL),
])

export const CurrencySchema = object({
  code: CurrencyCodeSchema,
})

export const AmountSchema = string().refine(
  (v) => /^\d*$/.test(v),
  "Amount should be numeric string",
)

export const AccuracySchema = number({
  invalid_type_error: "Accuracy should be bigint",
})
  .refine((v) => v > 0, "Accuracy should be more than 0")
  .refine((v) => v <= 18, "Accuracy should be less than 19")

export const MoneySchema = object({
  currency: CurrencySchema,
  amount: AmountSchema,
  accuracy: AccuracySchema,
})
