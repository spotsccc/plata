import { Button, Select, Stack, TextInput, Title } from "@mantine/core";
import { useUnit } from "effector-react";
import { Currency } from "~/modules/finance/lib/model";
import { Link } from "~/shared/ui/link";
import {
  $currency,
  $name,
  currencyChanged,
  nameChanged,
  submitted,
} from "./model";

export function AccountCreatePage() {
  const { name, nameHandler, currency, currencyHandler, submitHandler } =
    useUnit({
      name: $name,
      nameHandler: nameChanged,
      currency: $currency,
      currencyHandler: currencyChanged,
      submitHandler: submitted,
    });
  return (
    <Stack p="lg">
      <Title style={{ textAlign: "center" }}>Create account</Title>
      <Stack gap="md">
        <Stack gap="xs">
          <TextInput
            value={name}
            onChange={(e) => nameHandler(e.target.value)}
            label="Account name"
            placeholder="Enter account name"
          />
          <Select
            value={currency}
            onChange={(value) => currencyHandler(value as Currency)}
            label="Default currency"
            placeholder="Select default currency"
            data={Object.keys(Currency)}
          />
        </Stack>
        <Stack gap="xs">
          <Button onClick={submitHandler}>Create</Button>
          <Button
            variant="light"
            color="gray"
            component={Link}
            href="/accounts"
          >
            Cancel
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
}
