import { Button, Card, Center, Group, Stack, TextInput } from "@mantine/core";
import { useUnit } from "effector-react";
import {
  $email,
  $emailError,
  $loading,
  $password,
  $passwordError,
  $repeatedPassword,
  $repeatedPasswordError,
  $username,
  $usernameError,
  emailChanged,
  passwordChanged,
  repeatedPasswordChanged,
  submitted,
  usernameChanged,
} from "./model";

export function RegisterPage() {
  const {
    emailHandler,
    usernameHandler,
    passwordHandler,
    repeatedPasswordHander,
    email,
    username,
    password,
    repeatedPassword,
    emailError,
    submitHandler,
    loading,
    usernameError,
    passwordError,
    repeatedPasswordError,
  } = useUnit({
    emailHandler: emailChanged,
    usernameHandler: usernameChanged,
    passwordHandler: passwordChanged,
    repeatedPasswordHander: repeatedPasswordChanged,
    email: $email,
    username: $username,
    password: $password,
    repeatedPassword: $repeatedPassword,
    submitHandler: submitted,
    emailError: $emailError,
    passwordError: $passwordError,
    usernameError: $usernameError,
    repeatedPasswordError: $repeatedPasswordError,
    loading: $loading,
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
            value={username}
            error={usernameError}
            onChange={(e) => usernameHandler(e.target.value)}
            label="Username"
            placeholder="awesome-username"
          />
          <TextInput
            value={password}
            error={passwordError}
            onChange={(e) => passwordHandler(e.target.value)}
            label="Password"
            placeholder="password"
            type="password"
          />
          <TextInput
            error={repeatedPasswordError}
            value={repeatedPassword}
            onChange={(e) => repeatedPasswordHander(e.target.value)}
            label="Repeat password"
            placeholder="password"
            type="password"
          />
          <Button loading={loading} onClick={submitHandler}>
            Register
          </Button>
        </Stack>
      </Card>
    </Center>
  );
}
