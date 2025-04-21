import { Button, Stack, TextInput, Text } from "@mantine/core";
import { reatomComponent } from "@reatom/react";
import { wrap } from "@reatom/core";
import {
  $accountCurrency,
  $accountCurrencyError,
  $accountName,
  $accountNameError,
  submit,
  $loading,
  $error,
  $finished,
} from "./model";
import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

export const CreateAccountPage = reatomComponent(() => {
  const navigate = useNavigate();
  const finished = $finished();

  useEffect(() => {
    if (finished) {
      navigate({ to: "/" });
    }
  }, [finished, navigate]);

  return (
    <Stack>
      <TextInput
        disabled={$loading()}
        value={$accountName()}
        placeholder="Account name"
        onChange={wrap((e) => $accountName(e.target.value))}
        label="Account name"
        error={$accountNameError()}
      />
      <TextInput
        disabled={$loading()}
        value={$accountCurrency()}
        placeholder="Default currency"
        onChange={wrap((e) => $accountCurrency(e.target.value))}
        label="Default currency"
        error={$accountCurrencyError()}
      />
      <Button loading={$loading()} onClick={wrap(submit)}>
        Create
      </Button>
      {$error() && <Text c="red">{$error()?.message}</Text>}
    </Stack>
  );
}, "CreateAccountPage");
