import { Box, Text, TextInput, useCombobox } from "@mantine/core";
import { useUnit } from "effector-react";
import { Combobox } from "~/client/shared/ui/combobox";
import { Currency } from "~/shared/currencies";
import { $defaultCurrency, defaultCurrencySelected } from "./model";

const currencyOptions = Object.values(Currency).map((currency) => ({
  id: currency,
  value: currency,
}));

export function MainPage() {
  const { defaultCurrency, defaultCurrencyHandler } = useUnit({
    defaultCurrency: $defaultCurrency,
    defaultCurrencyHandler: defaultCurrencySelected,
  });

  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  return (
    <div>
      <Text>Accounts</Text>
      <Box>
        <TextInput label="Name" />
        <Combobox
          value={defaultCurrency}
          placeholder="Pick currency"
          selectHandler={defaultCurrencyHandler}
          options={currencyOptions}
        />
      </Box>
    </div>
  );
}
