import { formatMoney } from "@/shared/lib/money"
import { Normalized } from "api-contracts"
import { Store } from "effector"
import { useStoreMap, useUnit } from "effector-react"
import { AccountId, SubAccount, SubAccountId } from "models"
import { FC } from "react"

export type SubAccountListProps = {
  $subAccounts: Store<Normalized<SubAccount>>
  accountId: AccountId
  Slot?: FC
}
export function SubAccountList({
  $subAccounts,
  accountId,
  Slot,
}: SubAccountListProps) {
  const { subAccounts } = useUnit({
    subAccounts: $subAccounts,
  })
  const ids = subAccounts.ids.filter(
    (id) => subAccounts.entities[id].accountId === accountId,
  )
  return (
    <ul className="flex gap-1">
      {ids.map((id) => (
        <li key={id}>
          <SubAccountView subAccountId={id} $subAccounts={$subAccounts} />
        </li>
      ))}
      <li>{Slot && <Slot />}</li>
    </ul>
  )
}

export type SubAccountProps = {
  $subAccounts: Store<Normalized<SubAccount>>
  subAccountId: SubAccountId
}
export function SubAccountView({
  $subAccounts,
  subAccountId,
}: SubAccountProps) {
  const subAccount = useStoreMap({
    store: $subAccounts,
    keys: [subAccountId],
    fn: (subAccounts, [id]) => subAccounts.entities[id],
  })
  return (
    <div className="p-3 border-2 rounded-md">
      {formatMoney({ money: subAccount.total })}
    </div>
  )
}
