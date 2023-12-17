import { createEvent, createStore, sample } from "effector"
import { TransactionType } from "models"
import { typeSelectingCanceled, typeSelectingFinished } from "./step"

export const TRANSACTION_TYPES = [
  { value: TransactionType.expense, name: TransactionType.expense },
  { value: TransactionType.exchange, name: TransactionType.exchange },
  { value: TransactionType.income, name: TransactionType.income },
]

export const $type = createStore<{
  value: TransactionType
  name: TransactionType
} | null>(null)
export const $typeSelectOpened = createStore(false)

export const reseted = createEvent()

export const typeVibilityChanged = createEvent<boolean>()
export const typeSelected = createEvent<{
  value: TransactionType
  name: TransactionType
} | null>()

export const nextButtonClicked = createEvent()
export const cancelButtonClicked = createEvent()

sample({
  clock: reseted,
  target: [$type.reinit!, $typeSelectOpened.reinit!],
})

sample({
  clock: typeSelected,
  target: $type,
})

sample({
  clock: typeVibilityChanged,
  target: $typeSelectOpened,
})

sample({
  clock: nextButtonClicked,
  target: typeSelectingFinished,
})

sample({
  clock: cancelButtonClicked,
  target: typeSelectingCanceled,
})
