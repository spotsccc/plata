import { action, wrap } from "@reatom/core";
import { getCurrencies as getCurrenciesInner } from "../../infra/currency/get-currencies";

export const getCurrencies = action(async () => {
  return await wrap(getCurrenciesInner());
});
