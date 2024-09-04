import { Stack, NumberFormatter, Group, Text, Button } from "@mantine/core";
import { useUnit } from "effector-react";
import { Header } from "./header";
import { $amount } from "../model/amount";
import { $currency } from "../model/currency";
import { $account } from "../model/core";

export function FinalScreen() {
  return <IncomeFinalPage />;
}

function IncomeFinalPage() {
  const { amount, currency, account } = useUnit({
    amount: $amount,
    currency: $currency,
    account: $account,
  });

  return (
    <Stack p="lg" h="100dvh" justify="space-between">
      <Stack>
        <Header title="Check transaction's data" />
        <Group justify="space-between">
          <Text>Account:</Text> <Text>{account?.name}</Text>
        </Group>
        <Group justify="space-between">
          Amount:
          <NumberFormatter
            value={amount}
            suffix={` ${currency}`}
            thousandSeparator=" "
          />
        </Group>
      </Stack>
      <Stack>
        <Button>Create transaction</Button>
      </Stack>
    </Stack>
  );
}
