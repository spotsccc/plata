import { createEvent, createStore, sample } from "effector"
import { BaseCategories } from "models"

export const $categorySelectOpened = createStore(false)
export const $category = createStore<{
  value: BaseCategories
  name: BaseCategories
} | null>(null)
export const $categoryError = createStore("")

export const reseted = createEvent()

export const categoryVisibilityChanged = createEvent<boolean>()
export const categorySelected = createEvent<{
  value: BaseCategories
  name: BaseCategories
} | null>()
export const categoryFocused = createEvent()

sample({
  clock: reseted,
  target: [$category.reinit!, $categoryError.reinit!],
})

sample({
  clock: categoryVisibilityChanged,
  target: $categorySelectOpened,
})

sample({
  clock: categorySelected,
  target: $category,
})

sample({
  clock: categoryFocused,
  target: $categoryError.reinit!,
})
