import { createEvent, restore, createStore, sample, split } from "effector";
import { navigate } from "~/client/shared/router";
import {
  getValidationError,
  isUnknownErrorResponse,
  isValidationErrorResponse,
  ValidationErrorResponse,
} from "~/shared/errors";
import { spread } from "patronum";
import { notify } from "~/client/shared/notifications";
import { registerMutation } from "./api";
import { Error } from "~/shared/result";

export const emailChanged = createEvent<string>();
export const passwordChanged = createEvent<string>();
export const usernameChanged = createEvent<string>();
export const repeatPasswordChanged = createEvent<string>();
export const submitted = createEvent();

const knownErrorHappend = createEvent<{ message: string; field: string }>();
const usernameAlreadyExistErrorHappend = createEvent();
const emailAlreadyExistErrorHappend = createEvent();
const registerNavigate = navigate.prepend(() => ({ path: "/accounts" }));

export const $email = restore(emailChanged, "");
export const $password = restore(passwordChanged, "");
export const $username = restore(usernameChanged, "");
export const $repeatPassword = restore(repeatPasswordChanged, "");

export const $emailError = createStore<string | null>(null);
export const $passwordError = createStore<string | null>(null);
export const $usernameError = createStore<string | null>(null);
export const $repeatPasswordError = createStore<string | null>(null);

export const $loading = registerMutation.$pending;

sample({
  clock: emailChanged,
  target: $emailError.reinit,
});

sample({
  clock: passwordChanged,
  target: $passwordError.reinit,
});

sample({
  clock: usernameChanged,
  target: $usernameError.reinit,
});

sample({
  clock: repeatPasswordChanged,
  target: $repeatPasswordError.reinit,
});

sample({
  clock: submitted,
  source: {
    email: $email,
    password: $password,
    username: $username,
    repeatPassword: $repeatPassword,
  },
  target: registerMutation.start,
});

sample({
  clock: registerMutation.finished.success,
  filter: ({ result }) => result.tag === "success",
  target: registerNavigate,
});

sample({
  clock: registerMutation.finished.success,
  filter: ({ result }) => result.tag === "error",
  fn: ({ result }) => (result as Error<any>).error,
  target: knownErrorHappend,
});

split({
  source: knownErrorHappend,
  match: ({ field }) => field,
  cases: {
    email: emailAlreadyExistErrorHappend,
    username: usernameAlreadyExistErrorHappend,
  },
});

sample({
  clock: emailAlreadyExistErrorHappend,
  fn: () => "User with this email already exist",
  target: $emailError,
});

sample({
  clock: usernameAlreadyExistErrorHappend,
  fn: () => "User with this username already exist",
  target: $usernameError,
});

sample({
  clock: registerMutation.finished.failure,
  filter: isValidationErrorResponse,
  fn(res: ValidationErrorResponse) {
    return {
      email: getValidationError(res.error, "email"),
      password: getValidationError(res.error, "password"),
      repeatPassword: getValidationError(res.error, "repeatPassword"),
      username: getValidationError(res.error, "username"),
    };
  },
  target: spread({
    targets: {
      email: $emailError,
      repeatPassword: $repeatPasswordError,
      password: $passwordError,
      username: $usernameError,
    },
  }),
});

sample({
  clock: registerMutation.finished.failure,
  filter: isUnknownErrorResponse,
  target: notify.prepend(() => ({
    type: "error",
    title: "Can't authorize",
    message: "Something went wrong",
  })),
});
