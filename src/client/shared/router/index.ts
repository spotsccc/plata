import {
  attach,
  createEffect,
  createEvent,
  createStore,
  sample,
} from "effector";
import Router from "next/router";

const $router = createStore(Router);

export const navigate = createEvent<{ path: string }>();

const navigateFx = attach({
  source: {
    router: $router,
  },
  effect: createEffect(
    ({ router, path }: { router: typeof Router; path: string }) => {
      router.push(path);
    },
  ),
  mapParams({ path }: { path: string }, { router }) {
    return {
      router,
      path,
    };
  },
});

sample({
  clock: navigate,
  target: navigateFx,
});
