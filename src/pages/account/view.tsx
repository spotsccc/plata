import { reatomComponent } from "@reatom/react";
import { $account } from "./model";
import { Stack, Title, Text, Group, Button } from "@mantine/core";
import { Money } from "../accounts/model";
import { Link } from "@tanstack/react-router";

export const AccountPage = reatomComponent(() => {
  const account = $account.data();

  return (
    <Stack>
      <Title>{account?.name}</Title>
      <Balance />
      <Group>
        <Link
          search={{ type: "income" }}
          to="/accounts/$id/transactions/create"
          params={{ id: account?.id ?? "" }}
        >
          Income
        </Link>
        <Link
          search={{ type: "expense" }}
          to="/accounts/$id/transactions/create"
          params={{ id: account?.id ?? "" }}
        >
          Expense
        </Link>
        <Link
          search={{ type: "transfer" }}
          to="/accounts/$id/transactions/create"
          params={{ id: account?.id ?? "" }}
        >
          Transfer
        </Link>
      </Group>
    </Stack>
  );
});

export const Balance = reatomComponent(() => {
  const balance = $account.data()?.balance;

  if (!balance) return null;

  return (
    <Stack>
      {Object.keys(balance).map((currency) => (
        <Text key={currency}>{formatMoney(balance[currency])}</Text>
      ))}
    </Stack>
  );
}, "Balance");

function formatMoney(money: Money) {
  const int = money.amount.slice(0, money.accuracy).padStart(1, "0");
  const dec = money.amount.slice(money.accuracy).padEnd(2, "0");
  return `${int}.${dec} ${money.currency}`;
}
