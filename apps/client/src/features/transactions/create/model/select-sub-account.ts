import { createEvent, createStore, sample } from "effector"
import {
  subAccountSelectingCanceled,
  subAccountSelectingFinished,
} from "./step"

export const $selectedSubAccountSelectOpened = createStore(false)
export const $selectedSubAccount = createStore<{
  name: string
  value: string
} | null>(null)

export const selectedSubAccountVisibilityChanged = createEvent<boolean>()
export const subAccountSelected = createEvent<{
  name: string
  value: string
} | null>()

export const nextButtonClicked = createEvent()
export const cancelButtonClicked = createEvent()

sample({
  clock: selectedSubAccountVisibilityChanged,
  target: $selectedSubAccountSelectOpened,
})

sample({
  clock: subAccountSelected,
  target: $selectedSubAccount,
})

sample({
  clock: nextButtonClicked,
  target: subAccountSelectingFinished,
})

sample({
  clock: cancelButtonClicked,
  target: subAccountSelectingCanceled,
})
