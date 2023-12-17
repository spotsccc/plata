import { createEvent, createStore, sample } from "effector"

import { isValidAmount, normilizeAmount } from "./amount"
import { CurrencyCode } from "models"

export const $exchangeAmount = createStore("")
export const $exchangeAmountError = createStore("")

export const $exchangeCurrencySelectOpened = createStore(false)
export const $exchangeCurrency = createStore<{
  value: CurrencyCode
  name: CurrencyCode
} | null>(null)
export const $exchangeCurrencyError = createStore("")

export const $exchangeReceiverSelectOpened = createStore(false)
export const $exchangeReceiver = createStore("")

export const reseted = createEvent()

export const exchangeAmountChanged = createEvent<string>()
export const exchangeAmountFocused = createEvent()
export const exchangeAmountBlured = createEvent()

export const exchangeCurrencySelected = createEvent<{
  value: CurrencyCode
  name: CurrencyCode
} | null>()
export const exchangeCurrencyFocused = createEvent()
export const exchangeCurrencyVisibilityChanged = createEvent<boolean>()

export const exchangeReceiverVisibilityChanged = createEvent<boolean>()
export const exchangeReceiverSelected = createEvent<string>()

sample({
  clock: reseted,
  target: [
    $exchangeAmount.reinit!,
    $exchangeAmountError.reinit!,
    $exchangeCurrency.reinit!,
    $exchangeCurrencyError.reinit!,
  ],
})

sample({
  clock: exchangeAmountChanged,
  filter: (amount) => isValidAmount({ amount }),
  target: $exchangeAmount,
})

sample({
  clock: exchangeAmountFocused,
  target: $exchangeAmountError.reinit!,
})

sample({
  clock: exchangeAmountBlured,
  source: $exchangeAmount,
  fn: (amount) => normilizeAmount({ amount }),
  target: $exchangeAmount,
})

sample({
  clock: exchangeCurrencyVisibilityChanged,
  target: $exchangeCurrencySelectOpened,
})

sample({
  clock: exchangeCurrencySelected,
  target: $exchangeCurrency,
})

sample({
  clock: exchangeCurrencyFocused,
  target: $exchangeCurrencyError.reinit!,
})

sample({
  clock: exchangeReceiverSelected,
  target: $exchangeReceiver,
})

sample({
  clock: exchangeCurrencyVisibilityChanged,
  target: $exchangeCurrencySelectOpened,
})
