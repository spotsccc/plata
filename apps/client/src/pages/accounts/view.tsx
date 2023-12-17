import { Account, AccountId, SubAccount } from "models"
import { Link } from "atomic-router-react"
import { useStoreMap, useUnit } from "effector-react"
import { Store } from "effector"
import { Normalized } from "api-contracts"

import { CreateSubAccount } from "@/features/sub-accounts/create"
import { CreateAccount } from "@/features/accounts/create"
import { accountRoute } from "@/shared/router"
import { Header } from "@/shared/ui/header/view"
import { SubAccountList } from "@/widgets/sub-accounts-list"

import { $accounts, $subAccounts } from "./model"

export function AccountsPage() {
  return (
    <div>
      <Header pageName="Accounts" />
      <AccountList />
      <CreateAccount />
    </div>
  )
}

export type AccountListProps = {
  $accounts: Store<Normalized<Account>>
}
export function AccountList() {
  const { accounts } = useUnit({
    accounts: $accounts,
  })
  return (
    <ul>
      {accounts.ids.map((id) => (
        <AccountView
          key={id}
          accountId={id}
          $accounts={$accounts}
          $subAccounts={$subAccounts}
        />
      ))}
    </ul>
  )
}

export type AccountProps = {
  $accounts: Store<Normalized<Account>>
  $subAccounts: Store<Normalized<SubAccount>>
  accountId: AccountId
}
export function AccountView({ $accounts, accountId }: AccountProps) {
  const account = useStoreMap({
    store: $accounts,
    keys: [accountId],
    fn: (accounts, [id]) => accounts.entities[id],
  })
  return (
    <div className="p-3 border-2 rounded-xl">
      <div className="flex justify-between mb-4">
        <Link to={accountRoute} params={{ id: accountId }}>
          <h2>{account.name}</h2>
        </Link>
      </div>
      <SubAccountList
        $subAccounts={$subAccounts}
        accountId={accountId}
        Slot={() => <CreateSubAccount accountId={accountId} />}
      />
    </div>
  )
}
