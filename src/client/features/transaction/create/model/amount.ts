import { createEvent, restore, sample } from "effector";
import { persist } from "effector-storage/query";
import { goToNextStep, init } from "./core";

export const amountChanged = createEvent<string>();
export const amountSubmitted = createEvent();

export const $amount = restore(amountChanged, "");

persist({
  store: $amount,
  key: "amount",
});

sample({
  clock: init,
  fn: ({ amount }) => amount ?? "",
  target: $amount,
});

sample({
  clock: amountSubmitted,
  target: goToNextStep,
});
