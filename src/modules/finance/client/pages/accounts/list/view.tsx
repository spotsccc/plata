import {
  Button,
  Group,
  NumberFormatter,
  Paper,
  Stack,
  Text,
  Title,
  UnstyledButton,
} from "@mantine/core";
import { Link } from "~/shared/ui/link";
import Image from "next/image";
import { useStoreMap, useUnit } from "effector-react";
import { $accounts, createIncomeTransactionClicked } from "./model";

export function AccountsPage() {
  const { accounts } = useUnit({ accounts: $accounts });
  return (
    <Stack p="xl" gap="sm">
      <Title style={{ textAlign: "center" }}>Accounts</Title>
      <Button component={Link} href="/accounts/create" size="md">
        Create new account
      </Button>
      <Stack gap="sm">
        {accounts.map((account) => (
          <AccountCard key={account.id!} id={account.id!} />
        ))}
      </Stack>
    </Stack>
  );
}

export function AccountCard({ id }: { id: number }) {
  const account = useStoreMap({
    store: $accounts,
    keys: [id],
    fn: (accounts, [id]) => accounts.find((account) => account.id === id),
  });

  const { incomeHandler } = useUnit({
    incomeHandler: createIncomeTransactionClicked,
  });

  if (!account) {
    throw new Error("Account does not exist");
  }

  return (
    <Paper radius="md" withBorder w="100%">
      <Group justify="space-between" p="md">
        <Stack>
          <Stack gap="sm">
            <Text>{account?.name}</Text>
            <NumberFormatter
              prefix={`${account?.defaultCurrency} `}
              value={account.balance[account.defaultCurrency].amount}
              thousandSeparator
            />
          </Stack>
          <Group>
            <UnstyledButton
              bg="teal.4"
              w={24}
              h={24}
              style={{
                borderRadius: "50%",
                justifyContent: "center",
                alignItems: "center",
                display: "flex",
              }}
              onClick={() => incomeHandler({ accountId: account.id! })}
            >
              <Image
                src="/icons/arrow-top.svg"
                alt="graphic"
                height={16}
                width={16}
              />
            </UnstyledButton>
            <UnstyledButton
              bg="red.4"
              w={24}
              h={24}
              style={{
                borderRadius: "50%",
                justifyContent: "center",
                alignItems: "center",
                display: "flex",
              }}
            >
              <Image
                src="/icons/arrow-bottom.svg"
                alt="graphic"
                height={16}
                width={16}
              />
            </UnstyledButton>
            <UnstyledButton
              bg="yellow.3"
              w={24}
              h={24}
              style={{
                borderRadius: "50%",
                justifyContent: "center",
                alignItems: "center",
                display: "flex",
              }}
            >
              <Image
                src="/icons/arrows-top-bottom.svg"
                alt="graphic"
                height={16}
                width={16}
              />
            </UnstyledButton>
          </Group>
        </Stack>
        <Stack align="center">
          <Image src="/graphic.svg" alt="graphic" height={65} width={39} />
          <Link href="/accounts">
            <Text c="blue.3">View statictics</Text>
          </Link>
        </Stack>
      </Group>
    </Paper>
  );
}
