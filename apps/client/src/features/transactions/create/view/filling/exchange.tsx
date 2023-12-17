import { Input } from "@/shared/ui/input"
import {
  $exchangeAmount,
  $exchangeAmountError,
  $exchangeCurrency,
  $exchangeCurrencyError,
  exchangeAmountBlured,
  exchangeAmountChanged,
  exchangeAmountFocused,
  exchangeCurrencySelected,
  exchangeCurrencyVisibilityChanged,
  $exchangeCurrencySelectOpened,
  exchangeCurrencyFocused,
} from "../../model/filling/exchange"
import { useUnit } from "effector-react"
import { Combobox } from "@/shared/ui/combobox"
import { CurrencyCode } from "models"

export const CURRENCY_VARIANTS = [
  { value: CurrencyCode.USD, name: CurrencyCode.USD },
  { value: CurrencyCode.ARS, name: CurrencyCode.ARS },
  { value: CurrencyCode.USDT, name: CurrencyCode.USDT },
  { value: CurrencyCode.RUB, name: CurrencyCode.RUB },
  { value: CurrencyCode.GEL, name: CurrencyCode.GEL },
  { value: CurrencyCode.BTC, name: CurrencyCode.BTC },
  { value: CurrencyCode.ETH, name: CurrencyCode.ETH },
]

export function FillExchange() {
  return (
    <>
      <ExchangeAmount />
      <ExchangeCurrency />
    </>
  )
}

export function ExchangeAmount() {
  const { value, onChange, onBlur, errorMessage, onFocus } = useUnit({
    onChange: exchangeAmountChanged,
    value: $exchangeAmount,
    onBlur: exchangeAmountBlured,
    errorMessage: $exchangeAmountError,
    onFocus: exchangeAmountFocused,
  })

  return (
    <Input
      onFocus={onFocus}
      label="Exchange amount"
      placeholder="exchange amount"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      type="string"
      onBlur={onBlur}
      errorMassage={errorMessage}
    />
  )
}

export function ExchangeCurrency() {
  const { value, onSelect, errorMassage, onFocus, isOpen, onOpenChange } =
    useUnit({
      onSelect: exchangeCurrencySelected,
      value: $exchangeCurrency,
      errorMassage: $exchangeCurrencyError,
      onFocus: exchangeCurrencyFocused,
      isOpen: $exchangeCurrencySelectOpened,
      onOpenChange: exchangeCurrencyVisibilityChanged,
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
