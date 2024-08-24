import { Center, Card, Stack, TextInput, Button } from "@mantine/core";
import { useUnit } from "effector-react";
import {
  $email,
  $emailError,
  $loading,
  $password,
  emailChanged,
  passwordChanged,
  submitted,
} from "./model";

export function LoginPage() {
  const {
    email,
    password,
    loading,
    emailError,
    emailHandler,
    passwordHandler,
    submitHandler,
  } = useUnit({
    emailError: $emailError,
    email: $email,
    password: $password,
    emailHandler: emailChanged,
    passwordHandler: passwordChanged,
    loading: $loading,
    submitHandler: submitted,
  });

  return (
    <Center h="100vh">
      <Card w="500px" radius="lg" p="30px">
        <Stack gap="sm">
          <TextInput
            value={email}
            onChange={(e) => emailHandler(e.target.value)}
            label="Email"
            placeholder="email@example.com"
            type="email"
            error={emailError}
          />
          <TextInput
            value={password}
            onChange={(e) => passwordHandler(e.target.value)}
            label="Password"
            placeholder="password"
            type="password"
          />
          <Button loading={loading} onClick={submitHandler}>
            Login
          </Button>
        </Stack>
      </Card>
    </Center>
  );
}
