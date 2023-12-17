import { Button } from "@/shared/ui/button"
import { DialogFooter, DialogHeader } from "@/shared/ui/dialog"
import { useUnit } from "effector-react"
import {
  $selectedSubAccount,
  $selectedSubAccountSelectOpened,
  cancelButtonClicked,
  nextButtonClicked,
  selectedSubAccountVisibilityChanged,
  subAccountSelected,
} from "../model/select-sub-account"
import { Combobox } from "@/shared/ui/combobox"
import { accountsGetQuery } from "@/shared/api/account/get-list"
import { combine } from "effector"
import { accountRoute } from "@/shared/router"

export function SelectSubAccount() {
  const { onCancel, onNext } = useUnit({
    onCancel: cancelButtonClicked,
    onNext: nextButtonClicked,
  })
  return (
    <>
      <DialogHeader>
        <p>Select sub account in which transaction will be created</p>
      </DialogHeader>
      <TransactionSubAccount />
      <DialogFooter>
        <Button onClick={onNext} type="submit">
          Next
        </Button>
        <Button onClick={onCancel} type="reset">
          Cancel
        </Button>
      </DialogFooter>
    </>
  )
}

const $subAccounts = accountsGetQuery.$data.map(({ subAccounts }) =>
  Object.values(subAccounts.entities),
)

const $subAccountsFiltered = combine(
  {
    subAccounts: $subAccounts,
    params: accountRoute.$params,
  },
  ({ subAccounts, params }) =>
    subAccounts.filter(({ accountId }) => accountId === params.id),
)

export function TransactionSubAccount() {
  const { isOpen, onOpenChange, selected, onSelect, subAccounts } = useUnit({
    isOpen: $selectedSubAccountSelectOpened,
    onOpenChange: selectedSubAccountVisibilityChanged,
    onSelect: subAccountSelected,
    selected: $selectedSubAccount,
    subAccounts: $subAccountsFiltered,
  })

  return (
    <Combobox
      placeholder="Search sub account"
      notFoundText="Sub account not found"
      notSelectedText="Select sub account"
      label="Sub account"
      options={subAccounts.map(({ name, id }) => ({ name, value: id }))}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      selected={selected}
      onSelect={onSelect}
    />
  )
}
