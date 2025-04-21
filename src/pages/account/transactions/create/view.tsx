import { FC } from "react";
import { $step, Step } from "./model";
import { reatomComponent } from "@reatom/react";
import { CurrencyScreen } from "./view/currency-screen";
import { AmountScreenView } from "./view/amount-screen";
import { FinalPage } from "./view/final-screen";

const STEPS: Record<Step, FC> = {
  currency: CurrencyScreen,
  amount: AmountScreenView,
  category: () => <div>Category</div>,
  recepient: () => <div>Recepient</div>,
  final: FinalPage,
};

export const AccountTransactionCreate = reatomComponent(() => {
  const Step = STEPS[$step()];
  return <Step />;
});
