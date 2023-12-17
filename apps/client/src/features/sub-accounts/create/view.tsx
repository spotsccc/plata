import { Button } from "@/shared/ui/button"
import { AccountId, CurrencyCode } from "models"
import {
  $creating,
  $currency,
  $currencyVisibility,
  $name,
  createButtonClicked,
  creatingCalceled,
  currencyChanged,
  currencyVisibilityChanged,
  nameChanged,
  submitted,
} from "./model"
import {
  DialogHeader,
  DialogContent,
  Dialog,
  DialogFooter,
} from "@/shared/ui/dialog"
import { useUnit } from "effector-react"
import { Combobox } from "@/shared/ui/combobox"
import { Input } from "@/shared/ui/input"

export type CreateSubAccountProps = {
  accountId: AccountId
}
export function CreateSubAccount({ accountId }: CreateSubAccountProps) {
  const { onClick } = useUnit({
    onClick: createButtonClicked,
  })
  return (
    <>
      <Button
        className="h-full border-2"
        onClick={(e) => {
          e.stopPropagation()
          onClick({ accountId })
        }}
      >
        +
      </Button>
      <CreateSubAccountDialog />
    </>
  )
}

export function CreateSubAccountDialog() {
  const { isOpened, onOpenChange } = useUnit({
    isOpened: $creating,
    onOpenChange: creatingCalceled,
  })
  return (
    <Dialog open={isOpened} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <p>Create sub account</p>
        </DialogHeader>
        <Name />
        <Currency />
        <DialogFooter>
          <Cancel />
          <Submit />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function Submit() {
  const { onClick } = useUnit({
    onClick: submitted,
  })
  return <Button onClick={onClick}>Create</Button>
}

export function Cancel() {
  const { onClick } = useUnit({
    onClick: creatingCalceled,
  })
  return <Button onClick={onClick}>Cancel</Button>
}

export function Name() {
  const { value, onChange } = useUnit({
    value: $name,
    onChange: nameChanged,
  })
  return (
    <Input
      label="Name"
      onChange={(e) => onChange(e.target.value)}
      value={value}
    />
  )
}

export const options = [
  { name: CurrencyCode.USD, value: CurrencyCode.USD },
  { name: CurrencyCode.RUB, value: CurrencyCode.RUB },
  { name: CurrencyCode.ARS, value: CurrencyCode.ARS },
  { name: CurrencyCode.BTC, value: CurrencyCode.BTC },
  { name: CurrencyCode.ETH, value: CurrencyCode.ETH },
  { name: CurrencyCode.USDT, value: CurrencyCode.USDT },
  { name: CurrencyCode.GEL, value: CurrencyCode.GEL },
]

export function Currency() {
  const { isOpen, onOpenChange, selected, onSelect } = useUnit({
    isOpen: $currencyVisibility,
    onOpenChange: currencyVisibilityChanged,
    selected: $currency,
    onSelect: currencyChanged,
  })
  return (
    <Combobox
      onSelect={onSelect}
      label="Currency"
      notSelectedText="Select currency"
      placeholder="Select currency"
      notFoundText="Currency not found"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      options={options}
      selected={selected}
    />
  )
}
