import { useUnit } from "effector-react"

import { DialogFooter, DialogHeader } from "@/shared/ui/dialog"
import { Combobox } from "@/shared/ui/combobox"
import { Button } from "@/shared/ui/button"

import {
  nextButtonClicked,
  cancelButtonClicked,
  $typeSelectOpened,
  typeVibilityChanged,
  typeSelected,
  $type,
  TRANSACTION_TYPES,
} from "../model/select-type"

export function SelectType() {
  const { onCancel, onNext } = useUnit({
    onCancel: cancelButtonClicked,
    onNext: nextButtonClicked,
  })
  return (
    <>
      <DialogHeader>
        <p>Select new transaction type</p>
      </DialogHeader>
      <TransactionTypeCombobox />
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

export function TransactionTypeCombobox() {
  const { isOpen, onOpenChange, selected, onSelect } = useUnit({
    isOpen: $typeSelectOpened,
    onOpenChange: typeVibilityChanged,
    onSelect: typeSelected,
    selected: $type,
  })
  return (
    <Combobox
      placeholder="Search type"
      notFoundText="Type not found"
      notSelectedText="Select type"
      label="Transaction type"
      options={TRANSACTION_TYPES}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      selected={selected}
      onSelect={onSelect}
    />
  )
}
