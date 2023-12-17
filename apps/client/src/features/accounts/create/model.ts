import { accountCreateMutation } from "@/shared/api/account/create"
import { AccountCreateRequest, AccountCreateRequestSchema } from "api-contracts"
import {
  combine,
  createEffect,
  createEvent,
  createStore,
  sample,
} from "effector"

export const $creating = createStore(false)
export const $name = createStore("")
export const $accountCreateData = combine({
  name: $name,
})

export const createButtonClicked = createEvent()
export const submitted = createEvent()
export const creatingCanceled = createEvent()
export const reinit = createEvent()
export const nameChanged = createEvent<string>()

export const accountCreateDataValidateFx = createEffect(
  (data: AccountCreateRequest) => {
    return AccountCreateRequestSchema.parse(data)
  },
)

sample({
  clock: reinit,
  target: [$creating.reinit!, $name.reinit!],
})

sample({
  clock: createButtonClicked,
  fn: () => true,
  target: $creating,
})

sample({
  clock: creatingCanceled,
  target: reinit,
})

sample({
  clock: nameChanged,
  target: $name,
})

sample({
  clock: submitted,
  source: $accountCreateData,
  target: accountCreateDataValidateFx,
})

sample({
  clock: accountCreateDataValidateFx.done,
  source: $accountCreateData,
  target: [accountCreateMutation.start, reinit],
})
