import {
  Stack,
  Title,
  TextInput,
  List,
  ListItem,
  UnstyledButton,
  Group,
  Text,
} from "@mantine/core";
import { CurrencyView } from "../model";
import { Currency } from "~/server/modules/finance/models/money";
import { Header } from "./header";

type Props = {
  currencies: Array<CurrencyView>;
  searchString: string;
  searchHandler: (v: string) => void;
  currencyHandler: (v: Currency) => void;
  title?: string;
};

export function CurrencyScreenView({
  currencyHandler,
  currencies,
  searchHandler,
  searchString,
  title,
}: Props) {
  return (
    <Stack p="lg" h="100dvh">
      <Stack>
        <Header title={title ?? "Select transaction currency"} />
        <TextInput
          value={searchString}
          onChange={(e) => searchHandler(e.target.value.toUpperCase())}
          placeholder="Search currency..."
        />
      </Stack>
      <List
        listStyleType="none"
        spacing="sm"
        h="100%"
        style={{ overflow: "scroll" }}
      >
        {currencies.map((currency) => (
          <ListItem key={currency.value}>
            <UnstyledButton onClick={() => currencyHandler(currency.value)}>
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
    </Stack>
  );
}
