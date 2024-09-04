import { Stack, TextInput, Button, Title, Text } from "@mantine/core";
import { useUnit } from "effector-react";
import { Link } from "~/shared/ui/link";
import {
  $email,
  $emailError,
  $loading,
  $password,
  $passwordError,
  $repeatPassword,
  $repeatPasswordError,
  $username,
  $usernameError,
  emailChanged,
  passwordChanged,
  repeatPasswordChanged,
  submitted,
  usernameChanged,
} from "./model";

export function RegisterPage() {
  const password = useUnit({
    value: $password,
    handler: passwordChanged,
    error: $passwordError,
  });

  const email = useUnit({
    value: $email,
    handler: emailChanged,
    error: $emailError,
  });

  const repeatPassword = useUnit({
    value: $repeatPassword,
    handler: repeatPasswordChanged,
    error: $repeatPasswordError,
  });

  const username = useUnit({
    value: $username,
    handler: usernameChanged,
    error: $usernameError,
  });

  const submitButton = useUnit({
    loading: $loading,
    handler: submitted,
  });

  return (
    <Stack w="100%" p="xl" gap="lg">
      <Title style={{ textAlign: "center" }}>
        Sign up to manage your finance
      </Title>
      <Stack gap="md">
        <TextInput
          value={email.value}
          onChange={(e) => email.handler(e.target.value)}
          error={email.error}
          size="md"
          label="Email"
          placeholder="Enter your email"
          type="email"
        />
        <TextInput
          value={username.value}
          onChange={(e) => username.handler(e.target.value)}
          error={username.error}
          size="md"
          label="Username"
          placeholder="Enter your username"
          type="text"
        />
        <TextInput
          value={password.value}
          onChange={(e) => password.handler(e.target.value)}
          error={password.error}
          size="md"
          label="Password"
          placeholder="Enter your password"
          type="password"
        />
        <TextInput
          value={repeatPassword.value}
          onChange={(e) => repeatPassword.handler(e.target.value)}
          error={repeatPassword.error}
          size="md"
          label="Repeat password"
          placeholder="Repeat your password"
          type="password"
        />
        <Button
          size="md"
          loading={submitButton.loading}
          onClick={submitButton.handler}
        >
          Sign up
        </Button>
      </Stack>
      <Link href="/auth/login">
        <Text c="blue.3">Already have account?</Text>
      </Link>
    </Stack>
  );
}
