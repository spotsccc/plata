import { attach, createEvent, createStore, sample } from "effector";
import Router from "next/router";

const $router = createStore(Router);

export const $currentUrl = $router.map((r) => {
  if (typeof window !== "undefined" && r.router !== null) {
    return r.route;
  }

  return null;
});

export const navigate = createEvent<{ path: string }>();
export const stepBack = createEvent();

const navigateFx = attach({
  source: {
    router: $router,
  },
  effect: ({ router }, { path }: { path: string }) => {
    router.push(path);
  },
});

const stepBackFx = attach({
  source: {
    router: $router,
  },
  effect: ({ router }) => {
    router.back();
  },
});

sample({
  clock: navigate,
  target: navigateFx,
});

sample({
  clock: stepBack,
  target: stepBackFx,
});
