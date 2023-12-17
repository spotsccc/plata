import { createEvent, createStore, sample } from "effector"
import { CurrencyCode } from "models"

import { isValidAmount, normilizeAmount } from "./amount"
import { fillingCanceled } from "../step"

export const $amount = createStore("")
export const $amountError = createStore("")

export const $currencySelectOpened = createStore(false)
export const $currency = createStore<{
  value: CurrencyCode
  name: CurrencyCode
} | null>(null)
export const $currencyError = createStore("")

export const reseted = createEvent()

export const amountChanged = createEvent<string>()
export const amountFocused = createEvent()
export const amountBlured = createEvent()

export const currencySelected = createEvent<{
  value: CurrencyCode
  name: CurrencyCode
} | null>()
export const currencyFocused = createEvent()
export const currencyVisibilityChanged = createEvent<boolean>()

export const createButtonClicked = createEvent()
export const previouseButtonClicked = createEvent()

sample({
  clock: reseted,
  target: [
    $amount.reinit!,
    $amountError.reinit!,
    $currency.reinit!,
    $currencyError.reinit!,
  ],
})

sample({
  clock: amountChanged,
  filter: (amount) => isValidAmount({ amount }),
  target: $amount,
})

sample({
  clock: amountFocused,
  target: $amountError.reinit!,
})

sample({
  clock: amountBlured,
  source: $amount,
  fn: (amount) => normilizeAmount({ amount }),
  target: $amount,
})

sample({
  clock: currencyVisibilityChanged,
  target: $currencySelectOpened,
})

sample({
  clock: currencySelected,
  target: $currency,
})

sample({
  clock: currencyFocused,
  target: $currencyError.reinit!,
})

sample({
  clock: previouseButtonClicked,
  target: fillingCanceled,
})
