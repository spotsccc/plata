import { useUnit } from "effector-react";
import { FC } from "react";
import { CurrencyScreenView } from "./view/currency-screen";
import { AmountScreenView } from "./view/amount-screen";
import { FinalScreen } from "./view/final";
import { amountChanged, $amount, amountSubmitted } from "./model/amount";
import { Step, $step } from "./model/core";
import {
  currencySelected,
  $searchCurrencyString,
  searchCurrencyStringChanged,
  $filteredCurrencies,
  $currency,
} from "./model/currency";

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
      disableBackButton
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
  return <Screen />;
}
