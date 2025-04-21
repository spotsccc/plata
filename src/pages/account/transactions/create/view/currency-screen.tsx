import {
  Stack,
  TextInput,
  List,
  ListItem,
  UnstyledButton,
  Group,
  Text,
} from "@mantine/core";
import { Header } from "./header";
import { reatomComponent } from "@reatom/react";
import {
  $currencies,
  $currency,
  $currencySearch,
  currencySelected,
} from "../model";
import { wrap } from "@reatom/core";

export const CurrencyScreen = reatomComponent(() => {
  return (
    <Stack h="100dvh">
      <Stack>
        <Header title={"Select transaction currency"} />
        <TextInput
          value={$currencySearch()}
          onChange={wrap((e) => $currencySearch(e.target.value))}
          placeholder="Search currency..."
        />
      </Stack>
      <List
        listStyleType="none"
        spacing="sm"
        h="100%"
        style={{ overflow: "scroll" }}
      >
        {$currencies.data()?.map((currency) => (
          <ListItem key={currency.name}>
            <UnstyledButton
              onClick={wrap(() => currencySelected(currency.name))}
            >
              <Group>
                <Text size="xl">{currency.name}</Text>
              </Group>
            </UnstyledButton>
          </ListItem>
        ))}
      </List>
    </Stack>
  );
}, "CurrencyScreen");
