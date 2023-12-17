import { accountsGetQuery } from "@/shared/api/account/get-list"
import { accountRoute } from "@/shared/router"
import { combine, sample } from "effector"

export const $account = combine(
  {
    params: accountRoute.$params,
    accountsData: accountsGetQuery.$data,
  },
  ({ params, accountsData }) => {
    return accountsData.accounts.entities[params.id]
  },
)

export const $subAccounts = combine(
  {
    accountsData: accountsGetQuery.$data,
  },
  ({ accountsData }) => {
    return accountsData.subAccounts
  },
)

sample({
  clock: accountRoute.opened,
  target: accountsGetQuery.start,
})
