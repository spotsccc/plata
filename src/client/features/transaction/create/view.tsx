import { useUnit } from "effector-react";
import {
  $amount,
  $currency,
  $filteredCurrencies,
  $searchCurrencyString,
  $step,
  amountChanged,
  amountSubmitted,
  currencySelected,
  searchCurrencyStringChanged,
  Step,
} from "./model";
import { FC } from "react";
import { CurrencyScreenView } from "./view/currency-screen";
import { AmountScreenView } from "./view/amount-screen";
import { FinalScreen } from "./view/final";
import { TypeScreen } from "./view/type-screen";

function CurrencyScreen() {
  const { currencyHandler, currencies, searchStringHandler, searchString } =
    useUnit({
      currencyHandler: currencySelected,
      searchString: $searchCurrencyString,
      searchStringHandler: searchCurrencyStringChanged,
      currencies: $filteredCurrencies,
    });

  return (
    <CurrencyScreenView
      currencyHandler={currencyHandler}
      currencies={currencies}
      searchString={searchString}
      searchHandler={searchStringHandler}
    />
  );
}

function AmountScreen() {
  const { amount, amountHandler, currency, submitHandler } = useUnit({
    amountHandler: amountChanged,
    amount: $amount,
    currency: $currency,
    submitHandler: amountSubmitted,
  });

  return (
    <AmountScreenView
      submitHandler={submitHandler}
      amountHandler={amountHandler}
      currency={currency!}
      amount={amount}
    />
  );
}

const SCREENS: Record<Step, FC> = {
  currency: CurrencyScreen,
  type: TypeScreen,
  receiveAmount: () => null,
  receiver: () => null,
  receiveCurrency: () => null,
  category: () => null,
  amount: AmountScreen,
  final: FinalScreen,
};

export function TransactionCreate() {
  const { step } = useUnit({ step: $step });
  const Screen = SCREENS[step];
  console.log(step);
  return <Screen />;
}
