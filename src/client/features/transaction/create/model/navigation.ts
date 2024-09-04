import { createEvent, sample } from "effector";
import { $account, $backUrl, goToPreviousStep } from "./core";
import { navigate } from "~/client/shared/router";

export const backButtonPressed = createEvent();
export const crossButtonPressed = createEvent();

sample({
  clock: backButtonPressed,
  target: goToPreviousStep,
});

sample({
  clock: crossButtonPressed,
  source: { backUrl: $backUrl, account: $account },
  fn: ({ backUrl, account }) => {
    if (backUrl) {
      return { path: backUrl };
    }

    return { path: `/accounts/${account?.id}` };
  },
  target: navigate,
});
