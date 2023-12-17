import { createEvent, createStore, sample } from "effector"

export enum Step {
  notStarted = "notStarted",
  selectingSubAccount = "selectingSubAccount",
  selectingType = "selectingType",
  fillingTransaction = "fillingTransaction",
}

export const $step = createStore(Step.notStarted)

export const reseted = createEvent()

export const creatingStarted = createEvent()

export const subAccountSelectingFinished = createEvent()
export const subAccountSelectingCanceled = createEvent()

export const typeSelectingFinished = createEvent()
export const typeSelectingCanceled = createEvent()

export const fillingCanceled = createEvent()

sample({
  clock: reseted,
  fn: () => Step.notStarted,
  target: $step,
})

sample({
  clock: creatingStarted,
  fn: () => Step.selectingSubAccount,
  target: $step,
})

sample({
  clock: subAccountSelectingFinished,
  fn: () => Step.selectingType,
  target: $step,
})

sample({
  clock: subAccountSelectingCanceled,
  fn: () => Step.notStarted,
  target: $step,
})

sample({
  clock: typeSelectingFinished,
  fn: () => Step.fillingTransaction,
  target: $step,
})

sample({
  clock: typeSelectingCanceled,
  fn: () => Step.selectingSubAccount,
  target: $step,
})

sample({
  clock: fillingCanceled,
  fn: () => Step.selectingType,
  target: $step,
})
