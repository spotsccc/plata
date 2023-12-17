import { useUnit } from "effector-react"

import { $account, $subAccounts } from "./model"
import { Header } from "@/shared/ui/header/view"
import { SubAccountList } from "@/widgets/sub-accounts-list"
import { CreateSubAccount } from "@/features/sub-accounts/create"
import { TransactionCreate } from "@/features/transactions/create"
import { accountsGetQuery } from "@/shared/api/account/get-list"

export function AccountPage() {
  const { account, loading } = useUnit({
    account: $account,
    loading: accountsGetQuery.$pending,
  })

  if (loading) {
    return (
      <div>
        <Header pageName="Account" />
        loading
      </div>
    )
  }

  if (!account) {
    return null
  }

  return (
    <div>
      <Header pageName="Account" />
      {account.name}
      <SubAccountList
        accountId={account.id}
        $subAccounts={$subAccounts}
        Slot={() => <CreateSubAccount accountId={account.id} />}
      />
      <TransactionCreate />
    </div>
  )
}
