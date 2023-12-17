import {
  combine,
  createEffect,
  createEvent,
  createStore,
  sample,
} from "effector"
import { AccountId, CurrencyCode } from "models"
import { SubAccountCreateRequestSchema } from "api-contracts"

import { subAccountCreateMutation } from "@/shared/api/sub-account/create"

export const $creating = createStore(false)
export const $accountId = createStore<AccountId | null>(null)
export const $name = createStore("")
export const $currency = createStore<{
  value: CurrencyCode
  name: CurrencyCode
} | null>(null)
export const $currencyVisibility = createStore(false)
export const $createSubAccountRequest = combine(
  {
    currency: $currency,
    accountId: $accountId,
    name: $name,
  },
  ({ currency, accountId, name }) => {
    return {
      total: {
        currency: {
          code: currency?.value,
        },
        accuracy: 2,
        amount: "0",
      },
      accountId,
      name,
    }
  },
)

export const createButtonClicked = createEvent<{
  accountId: AccountId
}>()
export const creatingCalceled = createEvent()
export const currencyChanged = createEvent<{
  name: CurrencyCode
  value: CurrencyCode
} | null>()
export const nameChanged = createEvent<string>()
export const currencyVisibilityChanged = createEvent<boolean>()
export const reinit = createEvent()
export const submitted = createEvent()

export const createSubAccountRequestValidateFx = createEffect(
  (request: unknown) => {
    return SubAccountCreateRequestSchema.parse(request)
  },
)

sample({
  clock: reinit,
  target: [
    $creating.reinit!,
    $currency.reinit!,
    $name.reinit!,
    $accountId.reinit!,
  ],
})

sample({
  clock: currencyVisibilityChanged,
  target: $currencyVisibility,
})

sample({
  clock: currencyChanged,
  target: $currency,
})

sample({
  clock: nameChanged,
  target: $name,
})

sample({
  clock: createButtonClicked,
  fn: () => true,
  target: $creating,
})

sample({
  clock: createButtonClicked,
  fn: ({ accountId }) => accountId,
  target: $accountId,
})

sample({
  clock: creatingCalceled,
  target: reinit,
})

sample({
  clock: submitted,
  source: $createSubAccountRequest,
  target: createSubAccountRequestValidateFx,
})

sample({
  clock: createSubAccountRequestValidateFx.doneData,
  target: subAccountCreateMutation.start,
})

sample({
  clock: subAccountCreateMutation.finished.success,
  target: reinit,
})
