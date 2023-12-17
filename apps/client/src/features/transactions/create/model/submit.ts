import { combine, createEffect, createEvent, sample } from "effector"
import {
  BaseCategories,
  CurrencyCode,
  TransactionExchange,
  TransactionExpense,
  TransactionType,
} from "models"
import { spread } from "patronum"
import {
  TransactionCreateRequest,
  TransctionCreateRequestSchema,
} from "api-contracts"

import { createTransactionMutation } from "@/shared/api/transactions/create"

import {
  $amount,
  $currency,
  createButtonClicked,
  reseted as commonReseted,
  $amountError,
  $currencyError,
} from "./filling/common"
import {
  $category,
  $categoryError,
  reseted as expenseReseted,
} from "./filling/expense"
import { $type, reseted as typeReseted } from "./select-type"
import {
  $exchangeAmount,
  $exchangeAmountError,
  $exchangeCurrency,
  $exchangeCurrencyError,
  reseted as exchangeReseted,
} from "./filling/exchange"
import { reseted as stepReseted } from "./step"
import { $selectedSubAccount } from "./select-sub-account"

export type ValidationSuccess = { success: true }
export type ValidationFailed = {
  success: false
  error: { issues: Array<{ field: string; message: string }> }
}

export type ValidationResult = ValidationSuccess | ValidationFailed

export const submitted = createEvent()
export const canceled = createEvent()

export const $newTransactionData = combine(
  {
    category: $category.map((v) => v?.value),
    amount: $amount,
    currency: $currency.map((v) => v?.value),
    type: $type.map((v) => v?.value),
    exchangeAmount: $exchangeAmount,
    exchangeCurrency: $exchangeCurrency.map((v) => v?.value),
    subAccountId: $selectedSubAccount.map((v) => v?.value),
  },
  combineNewTransaction,
)

const validateFx = createEffect(
  ({ tr }: { tr: TransactionCreateRequest }): ValidationResult => {
    const res = TransctionCreateRequestSchema.safeParse(tr)
    if (!res.success) {
      const { error } = res
      const parsedError = {
        issues: error.errors.map((error) => ({
          field: error.path.join("."),
          message: error.message,
        })),
      }
      return { success: false, error: parsedError }
    }
    return { success: true }
  },
)

sample({
  clock: createButtonClicked,
  source: $newTransactionData,
  fn: (tr) => ({ tr }),
  target: validateFx,
})

sample({
  clock: validateFx.doneData,
  source: $newTransactionData,
  filter: (_, res) => res.success,
  fn: (tr) => ({ transaction: tr }),
  target: [
    createTransactionMutation.start,
    typeReseted,
    exchangeReseted,
    expenseReseted,
    commonReseted,
    stepReseted,
  ],
})

sample({
  clock: canceled,
  target: [
    typeReseted,
    exchangeReseted,
    expenseReseted,
    commonReseted,
    stepReseted,
  ],
})

sample({
  clock: validateFx.doneData,
  filter: (res): res is ValidationFailed => !res.success,
  fn({ error }) {
    const errors: Record<string, string> = {}
    for (const issue of error.issues) {
      errors[issue.field] = issue.message
    }
    return errors
  },
  target: spread({
    targets: {
      "value.amount": $amountError,
      "value.currency.code": $currencyError,
      "exchange.amount": $exchangeAmountError,
      "exchange.currency.code": $exchangeCurrencyError,
      category: $categoryError,
    },
  }),
})

export function combineNewTransaction({
  amount,
  type,
  currency,
  exchangeAmount,
  exchangeCurrency,
  category,
  subAccountId,
}: {
  amount: string
  type: TransactionType
  currency: CurrencyCode
  exchangeCurrency: CurrencyCode
  exchangeAmount: string
  category: BaseCategories
  subAccountId: string
}): TransactionCreateRequest {
  switch (type) {
    case TransactionType.expense:
      return {
        subAccountId,
        category,
        type: TransactionType.expense,
        value: {
          amount: amount.replace(".", ""),
          accuracy: 2,
          currency: {
            code: currency,
          },
        },
      } as Omit<TransactionExpense, "creationDate" | "id">
    case TransactionType.exchange:
      return {
        subAccountId,
        type: TransactionType.exchange,
        exchange: {
          amount: exchangeAmount.replace(".", ""),
          accuracy: 2,
          currency: {
            code: exchangeCurrency,
          },
        },
        value: {
          amount: amount.replace(".", ""),
          accuracy: 2,
          currency: {
            code: currency,
          },
        },
      } as Omit<TransactionExchange, "creationDate" | "id">
    case TransactionType.income:
    default:
      return {
        subAccountId,
        type: TransactionType.income,
        value: {
          amount: amount.replace(".", ""),
          accuracy: 2,
          currency: {
            code: currency,
          },
        },
      }
  }
}
