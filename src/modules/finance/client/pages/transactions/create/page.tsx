import {
  Box,
  List,
  ListItem,
  NumberInput,
  UnstyledButton,
  Text,
  TextInput,
  Title,
  Space,
  Group,
  AppShell,
} from "@mantine/core";
import { useUnit } from "effector-react";
import {
  $account,
  $amount,
  $currency,
  $currencySearchString,
  $filteredCurrencies,
  $step,
  amountChanged,
  currencySelected,
  searchStringChanged,
} from "./model";

export function TransactionCreatePage() {
  const {
    amountHandler,
    amount,
    currencyHandler,
    currency,
    step,
    account,
    searchString,
    searchStringHandler,
    filteredCurrencies,
  } = useUnit({
    amount: $amount,
    currency: $currency,
    currencyHandler: currencySelected,
    amountHandler: amountChanged,
    step: $step,
    account: $account,
    searchString: $currencySearchString,
    filteredCurrencies: $filteredCurrencies,
    searchStringHandler: searchStringChanged,
  });

  if (!account) {
    throw new Error("Account does not set");
  }

  return (
    <AppShell padding="md" header={{ height: "100px" }}>
      {step === "currency" && (
        <>
          <AppShell.Header pt="md" px="md" bd="none">
            <Title size="h4">Select transaction currency</Title>
            <Space h="md" />
            <TextInput
              value={searchString}
              onChange={(e) =>
                searchStringHandler(e.target.value.toUpperCase())
              }
              placeholder="Search currency..."
            />
          </AppShell.Header>
          <AppShell.Main>
            <List listStyleType="none" spacing="sm">
              {filteredCurrencies.map((currency) => (
                <ListItem key={currency.value}>
                  <UnstyledButton
                    onClick={() => currencyHandler(currency.value)}
                  >
                    <Group>
                      <Text size="xl">{currency.value}</Text>
                      {currency.isDefault && (
                        <Text color="gray.6" size="xs">
                          Default
                        </Text>
                      )}
                      {!currency.isDefault && currency.isUsed && (
                        <Text size="xs">Used</Text>
                      )}
                    </Group>
                  </UnstyledButton>
                </ListItem>
              ))}
            </List>
          </AppShell.Main>
        </>
      )}
      {step === "amount" && (
        <>
          <AppShell.Header pt="md" px="md" bd="none">
            <Title size="h4">{currency}</Title>
          </AppShell.Header>
          <AppShell.Main>
            <NumberInput
              bd="none"
              value={amount}
              onChange={(e) => amountHandler(String(e))}
              thousandSeparator=" "
              placeholder="0.00"
              hideControls
            />
          </AppShell.Main>
        </>
      )}
    </AppShell>
  );
}
