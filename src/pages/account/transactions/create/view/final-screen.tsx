import { Stack, NumberFormatter, Group, Text, Button } from "@mantine/core";
import { Header } from "./header";
import { reatomComponent } from "@reatom/react";

import { $amount, $currency, $account, createTransaction } from "../model";
import { wrap } from "@reatom/core";

export const FinalPage = reatomComponent(() => {
  return (
    <Stack p="lg" h="100dvh" justify="space-between">
      <Stack>
        <Header title="Check transaction's data" />
        <Group justify="space-between">
          <Text>Account:</Text> <Text>{$account.data()?.name}</Text>
        </Group>
        <Group justify="space-between">
          Amount:
          <NumberFormatter
            value={$amount()}
            suffix={` ${$currency()}`}
            thousandSeparator=" "
          />
        </Group>
      </Stack>
      <Stack>
        <Button onClick={wrap(createTransaction)}>Create transaction</Button>
      </Stack>
    </Stack>
  );
}, "FinalPage");
