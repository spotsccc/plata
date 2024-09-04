import { Stack, TextInput, Button, Title, Text } from "@mantine/core";
import { useUnit } from "effector-react";
import {
  $email,
  $emailError,
  $loading,
  $password,
  $passwordError,
  emailChanged,
  passwordChanged,
  submitted,
} from "./model";
import { Link } from "~/client/shared/ui/link";

export function LoginPage() {
  const {
    email,
    password,
    loading,
    emailError,
    passwordError,
    emailHandler,
    passwordHandler,
    submitHandler,
  } = useUnit({
    emailError: $emailError,
    passwordError: $passwordError,
    email: $email,
    password: $password,
    emailHandler: emailChanged,
    passwordHandler: passwordChanged,
    loading: $loading,
    submitHandler: submitted,
  });

  return (
    <Stack w="100%" p="xl" gap="lg">
      <Title style={{ textAlign: "center" }}>
        Log in to manage your finance
      </Title>
      <Stack gap="md">
        <TextInput
          size="md"
          value={email}
          onChange={(e) => emailHandler(e.target.value)}
          label="Email"
          placeholder="Enter your email"
          type="email"
          error={emailError}
        />
        <TextInput
          size="md"
          error={passwordError}
          value={password}
          onChange={(e) => passwordHandler(e.target.value)}
          label="Password"
          placeholder="Enter your password"
          type="password"
        />
        <Button size="md" loading={loading} onClick={submitHandler}>
          Log in
        </Button>
      </Stack>
      <Link href="/auth/register">
        <Text c="blue.3">Don't have account?</Text>
      </Link>
    </Stack>
  );
}
