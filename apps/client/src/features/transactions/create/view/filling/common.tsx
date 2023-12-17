import { Button } from "@/shared/ui/button"
import { DialogFooter, DialogHeader } from "@/shared/ui/dialog"
import { $type } from "../../model/select-type"
import {
  $amount,
  $amountError,
  $currency,
  $currencyError,
  amountBlured,
  amountChanged,
  amountFocused,
  createButtonClicked,
  currencySelected,
  currencyFocused,
  previouseButtonClicked,
  $currencySelectOpened,
  currencyVisibilityChanged,
} from "../../model/filling/common"
import { useUnit } from "effector-react"
import { CurrencyCode, TransactionType } from "models"
import { Input } from "@/shared/ui/input"
import { FillExpense } from "./expense"
import { FillIncome } from "./income"
import { FillExchange } from "./exchange"
import { Combobox } from "@/shared/ui/combobox"

export const CURRENCY_VARIANTS = [
  { value: CurrencyCode.USD, name: CurrencyCode.USD },
  { value: CurrencyCode.ARS, name: CurrencyCode.ARS },
  { value: CurrencyCode.USDT, name: CurrencyCode.USDT },
  { value: CurrencyCode.RUB, name: CurrencyCode.RUB },
  { value: CurrencyCode.GEL, name: CurrencyCode.GEL },
  { value: CurrencyCode.BTC, name: CurrencyCode.BTC },
  { value: CurrencyCode.ETH, name: CurrencyCode.ETH },
]

export function FillTransaction() {
  const { type, onBack, onSubmit } = useUnit({
    type: $type,
    onBack: previouseButtonClicked,
    onSubmit: createButtonClicked,
  })
  const View = TRANSACTION_FILLING_VARIANTS[type!.value]
  return (
    <>
      <DialogHeader>
        <p>Fill transction</p>
      </DialogHeader>
      <TransactionAmount />
      <TransactionCurrency />
      <View />
      <DialogFooter>
        <Button onClick={onSubmit} type="submit">
          Create
        </Button>
        <Button onClick={onBack} type="reset">
          Back
        </Button>
      </DialogFooter>
    </>
  )
}

export function TransactionCurrency() {
  const { value, onSelect, errorMassage, onFocus, isOpen, onOpenChange } =
    useUnit({
      value: $currency,
      onSelect: currencySelected,
      errorMassage: $currencyError,
      onFocus: currencyFocused,
      isOpen: $currencySelectOpened,
      onOpenChange: currencyVisibilityChanged,
    })

  return (
    <Combobox
      placeholder="Search currency"
      notFoundText="Currency not found"
      notSelectedText="Select currency"
      label="Currency"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      options={CURRENCY_VARIANTS}
      selected={value}
      onSelect={onSelect}
      onFocus={onFocus}
      errorMassage={errorMassage}
    />
  )
}

export function TransactionAmount() {
  const { value, onChange, onBlur, errorMessage, onFocus } = useUnit({
    value: $amount,
    onChange: amountChanged,
    onBlur: amountBlured,
    errorMessage: $amountError,
    onFocus: amountFocused,
  })
  return (
    <Input
      onFocus={onFocus}
      label="Amount"
      placeholder="amount"
      value={value}
      onBlur={onBlur}
      errorMassage={errorMessage}
      onChange={(e) => onChange(e.target.value)}
      type="number"
    />
  )
}

export const TRANSACTION_FILLING_VARIANTS = {
  [TransactionType.expense]: FillExpense,
  [TransactionType.income]: FillIncome,
  [TransactionType.exchange]: FillExchange,
}
