import { sample } from "effector"

import { accountsGetQuery } from "@/shared/api/account/get-list"
import { accountsRoute } from "@/shared/router"

export const $accounts = accountsGetQuery.$data.map((data) => data.accounts)
export const $subAccounts = accountsGetQuery.$data.map(
  (data) => data.subAccounts,
)
export const $transactions = accountsGetQuery.$data.map(
  (data) => data.transactions,
)

sample({
  clock: accountsRoute.opened,
  target: accountsGetQuery.start,
})
