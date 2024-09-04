import { auth } from "./modules/auth/trpc";
import { finance } from "./modules/finance/trpc";
import { router, t } from "./trpc";

export const appRouter = router({
  finance,
  auth,
});

export type AppRouter = typeof appRouter;

export const createCaller = t.createCallerFactory(appRouter);
