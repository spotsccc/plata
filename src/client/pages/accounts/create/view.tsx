import { Box, Button, Text, TextInput, useCombobox } from "@mantine/core";
import { useUnit } from "effector-react";
import { Combobox } from "~/client/shared/ui/combobox";
import { Currency } from "~/shared/currencies";
import {
  $defaultCurrency,
  $name,
  defaultCurrencySelected,
  nameChanged,
  submitted,
} from "./model";

const currencyOptions = Object.values(Currency).map((currency) => ({
  id: currency,
  value: currency,
}));

export function CreateAccountPage() {
  const {
    defaultCurrency,
    defaultCurrencyHandler,
    name,
    nameHandler,
    submitHandler,
  } = useUnit({
    defaultCurrency: $defaultCurrency,
    defaultCurrencyHandler: defaultCurrencySelected,
    name: $name,
    nameHandler: nameChanged,
    submitHandler: submitted,
  });

  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  return (
    <div>
      <Text>Accounts</Text>
      <Box>
        <TextInput
          value={name}
          onChange={(e) => nameHandler(e.target.value)}
          label="Name"
        />
        <Combobox
          value={defaultCurrency}
          placeholder="Pick currency"
          selectHandler={defaultCurrencyHandler}
          options={currencyOptions}
        />
        <Button onClick={submitHandler}>Create</Button>
      </Box>
    </div>
  );
}
