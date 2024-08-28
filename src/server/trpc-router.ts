import { createTransactionProcuderu } from "~/modules/finance/controllers/transactions/create/trpc";
import { router } from "./trpc";
import { authRouter } from "~/modules/auth/server/controllers";
import { create } from "~/modules/finance/controllers/accounts/create";

export const appRouter = router({
  transactions: {
    create: createTransactionProcuderu,
  },
  accounts: {
    create,
  },
  auth: authRouter,
});

export type AppRouter = typeof appRouter;
