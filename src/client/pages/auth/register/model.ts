import { createEvent, createStore, restore, sample, split } from "effector";
import { registerMutation } from "./api";
import { navigate } from "~/client/shared/router";
import { spread } from "patronum";
import { isTRPCError } from "~/shared/errors";

export const emailChanged = createEvent<string>();
export const usernameChanged = createEvent<string>();
export const passwordChanged = createEvent<string>();
export const repeatedPasswordChanged = createEvent<string>();

export const submitted = createEvent();

const redirectToMain = navigate.prepend(() => ({ path: "/" }));
const showError = createEvent();

export const $email = restore(emailChanged, "");
export const $username = restore(usernameChanged, "");
export const $password = restore(passwordChanged, "");
export const $repeatedPassword = restore(repeatedPasswordChanged, "");

export const $emailError = createStore<null | string>(null);
export const $passwordError = createStore<null | string>(null);
export const $usernameError = createStore<null | string>(null);
export const $repeatedPasswordError = createStore<null | string>(null);

export const $loading = registerMutation.$pending;

sample({
  clock: submitted,
  source: {
    email: $email,
    username: $username,
    password: $password,
    repeatedPassword: $repeatedPassword,
  },
  target: registerMutation.start,
});

split({
  source: registerMutation.finished.success,
  match: ({ result }) => result.tag,
  cases: {
    error: showError,
    success: redirectToMain,
  },
});

sample({
  clock: registerMutation.finished.failure
    .map((res) => res.error)
    .filter({ fn: isTRPCError })
    .map((error) => error.data?.validationError),
  filter: Boolean,
  fn(error) {
    return {
      email:
        (error.fieldErrors["email"] && error.fieldErrors["email"][0]) ?? null,
      password:
        (error.fieldErrors["password"] && error.fieldErrors["password"][0]) ??
        null,
      username:
        (error.fieldErrors["username"] && error.fieldErrors["username"][0]) ??
        null,
      repeatedPassword:
        (error.fieldErrors["repeatedPassword"] &&
          error.fieldErrors["repeatedPassword"][0]) ??
        null,
    };
  },
  target: spread({
    targets: {
      email: $emailError,
      password: $passwordError,
      username: $usernameError,
      repeatedPassword: $repeatedPasswordError,
    },
  }),
});

sample({
  clock: emailChanged,
  target: $emailError.reinit,
});

sample({
  clock: passwordChanged,
  target: $passwordError.reinit,
});

sample({
  clock: repeatedPasswordChanged,
  target: $repeatedPasswordError.reinit,
});

sample({
  clock: usernameChanged,
  target: $usernameError.reinit,
});
