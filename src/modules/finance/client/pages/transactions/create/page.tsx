import {
  List,
  ListItem,
  NumberInput,
  UnstyledButton,
  Text,
  TextInput,
  Title,
  Group,
  Stack,
  Button,
} from "@mantine/core";
import { useUnit } from "effector-react";
import {
  $account,
  $amount,
  $currencySearchString,
  $filteredCurrencies,
  $step,
  amountChanged,
  amountSubmitted,
  currencySelected,
  searchStringChanged,
} from "./model";
import { useEffect, useRef, useState } from "react";

export function TransactionCreatePage() {
  const { step, account } = useUnit({
    step: $step,
    account: $account,
  });

  if (!account) {
    throw new Error("Account does not set");
  }

  return (
    <>
      {step === "currency" && <CurrencyScreen />}
      {step === "amount" && <AmountScreen />}
    </>
  );
}

export function CurrencyScreen() {
  const {
    currencyHandler,
    searchString,
    searchStringHandler,
    filteredCurrencies,
  } = useUnit({
    currencyHandler: currencySelected,
    searchString: $currencySearchString,
    filteredCurrencies: $filteredCurrencies,
    searchStringHandler: searchStringChanged,
  });

  return (
    <Stack p="lg" h="100dvh">
      <Stack>
        <Title size="h4">Select transaction currency</Title>
        <TextInput
          value={searchString}
          onChange={(e) => searchStringHandler(e.target.value.toUpperCase())}
          placeholder="Search currency..."
        />
      </Stack>
      <List
        listStyleType="none"
        spacing="sm"
        h="100%"
        style={{ overflow: "scroll" }}
      >
        {filteredCurrencies.map((currency) => (
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

export function AmountScreen() {
  const { amountHandler, amount, submitHandler } = useUnit({
    amount: $amount,
    submitHandler: amountSubmitted,
    amountHandler: amountChanged,
  });

  return (
    <Stack p="lg" h="100dvh" justify="space-between">
      <Stack>
        <Title>Enter amount</Title>
      </Stack>
      <AmountInput value={amount} changeHandler={amountHandler} />
      <Button onClick={submitHandler}>Create</Button>
    </Stack>
  );
}

export function AmountInput({
  value,
  changeHandler,
}: {
  value: string;
  changeHandler: (v: string) => void;
}) {
  const initialSize = 48;
  const ref = useRef<HTMLInputElement | null>(null);
  const divRef = useRef<HTMLDivElement>(null);
  const [fontSize, setFontSize] = useState(initialSize);

  function onChange(v: string | number) {
    const val = String(v);

    changeHandler(val);
  }

  useEffect(() => {
    if (ref.current && divRef.current) {
      const inputWidth = ref.current.getBoundingClientRect().width;
      const textWidth = divRef.current.getBoundingClientRect().width;
      if (textWidth > 0 && fontSize >= 12 && fontSize <= 48) {
        const newFontSize = fontSize * (inputWidth / 2 / textWidth);

        if (newFontSize < 12) {
          setFontSize(12);
          return;
        }

        if (newFontSize > 48) {
          setFontSize(48);
          return;
        }

        setFontSize(newFontSize);
      }
    }
  }, [value]);

  return (
    <>
      <div
        ref={divRef}
        style={{
          width: "auto",
          display: "inline-block",
          visibility: "hidden",
          position: "fixed",
          overflow: "auto",
          fontSize,
        }}
      >
        {value}
      </div>
      <NumberInput
        ref={ref}
        suffix=" USD"
        styles={{
          input: {
            fontSize: fontSize,
            textAlign: "center",
            height: 60,
            border: "none",
            background: "inherit",
          },
        }}
        value={value}
        onChange={onChange}
        thousandSeparator=" "
        placeholder="0.00 USD"
        hideControls
      />
    </>
  );
}
