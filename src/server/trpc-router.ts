import { router, t } from "./trpc";
import { authRouter } from "~/modules/auth/server/controllers";
import { finance } from "~/modules/finance/trpc";

export const appRouter = router({
  finance,
  auth: authRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = t.createCallerFactory(appRouter);
