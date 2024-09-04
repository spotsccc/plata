import { Button, Stack } from "@mantine/core";
import { AmountInput } from "./amount-input";
import { Header } from "./header";

type Props = {
  amount: string;
  amountHandler: (v: string) => void;
  submitHandler: () => void;
  title?: string;
  currency: string;
};

export function AmountScreenView({
  amountHandler,
  amount,
  submitHandler,
  title,
  currency,
}: Props) {
  return (
    <Stack p="lg" h="100dvh" justify="space-between">
      <Header title={title ?? "Enter amount"} />
      <AmountInput
        value={amount}
        changeHandler={amountHandler}
        currency={currency}
      />
      <Button onClick={submitHandler}>Next</Button>
    </Stack>
  );
}
