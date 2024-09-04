import { createEvent, restore, createStore, sample, split } from "effector";
import { loginMutation } from "./api";
import { navigate } from "~/client/shared/router";
import {
  getValidationError,
  isUnknownErrorResponse,
  isValidationErrorResponse,
  ValidationErrorResponse,
} from "~/shared/errors";
import { spread } from "patronum";
import { notify } from "~/client/shared/notifications";

export const emailChanged = createEvent<string>();
export const passwordChanged = createEvent<string>();
export const submitted = createEvent();

const loginNavigate = navigate.prepend(() => ({
  path: "/accounts",
}));
const wrongEmailOrPasswordErrorHappend = createEvent();

export const $email = restore(emailChanged, "");
export const $password = restore(passwordChanged, "");

export const $emailError = createStore<string | null>(null);
export const $passwordError = createStore<string | null>(null);

export const $loading = loginMutation.$pending;

sample({
  clock: [emailChanged],
  target: $emailError.reinit,
});

sample({
  clock: passwordChanged,
  filter: $emailError.map((e) => e === "Email or password is incorrect"),
  target: $emailError.reinit,
});

sample({
  clock: passwordChanged,
  target: $passwordError.reinit,
});

sample({
  clock: submitted,
  source: {
    email: $email,
    password: $password,
  },
  target: loginMutation.start,
});

split({
  source: loginMutation.finished.success.map((res) => res.result.tag),
  match: (tag) => tag,
  cases: {
    success: loginNavigate,
    error: wrongEmailOrPasswordErrorHappend,
  },
});

sample({
  clock: wrongEmailOrPasswordErrorHappend,
  fn: () => "Email or password is incorrect",
  target: $emailError,
});

sample({
  clock: loginMutation.finished.failure,
  filter: isValidationErrorResponse,
  fn(res: ValidationErrorResponse) {
    return {
      email: getValidationError(res.error, "email"),
      password: getValidationError(res.error, "password"),
    };
  },
  target: spread({
    targets: {
      email: $emailError,
      password: $passwordError,
    },
  }),
});

sample({
  clock: loginMutation.finished.failure,
  filter: isUnknownErrorResponse,
  target: notify.prepend(() => ({
    type: "error",
    title: "Can't authorize",
    message: "Something went wrong",
  })),
});
