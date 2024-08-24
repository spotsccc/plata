import { createEvent, restore, createStore, sample, split } from "effector";
import { loginMutation } from "./api";
import { navigate } from "~/client/shared/router";

export const emailChanged = createEvent<string>();
export const passwordChanged = createEvent<string>();
export const submitted = createEvent();

const loginNavigate = navigate.prepend(() => ({
  path: "/",
}));
const wrongEmailOrPasswordErrorHappend = createEvent();

export const $email = restore(emailChanged, "");
export const $password = restore(passwordChanged, "");

export const $emailError = createStore<string | null>(null);

export const $loading = loginMutation.$pending;

sample({
  clock: [emailChanged, passwordChanged],
  target: $emailError.reinit,
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
