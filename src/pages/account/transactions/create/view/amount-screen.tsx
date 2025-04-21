import { Button, Stack } from "@mantine/core";
import { AmountInput } from "./amount-input";
import { Header } from "./header";
import { reatomComponent } from "@reatom/react";
import { $amount, $currency, nextStep } from "../model";
import { wrap } from "@reatom/core";

export const AmountScreenView = reatomComponent(() => {
  return (
    <Stack h="100%" justify="space-between">
      <Header title={"Enter amount"} />
      <AmountInput
        value={$amount()}
        changeHandler={wrap((v) => $amount(v))}
        currency={$currency()}
      />
      <Button onClick={wrap(nextStep)}>Next</Button>
    </Stack>
  );
}, "AmountScreen");
