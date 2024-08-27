import { createTransactionProcuderu } from "~/modules/finance/controllers/transaction/create/trpc";
import { publicProcedure, router } from "./trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { Currency } from "~/modules/finance/lib/model";
import { db } from "./db";
import { accounts } from "~/modules/finance/database/schemas";
import { insertUser } from "./modules/user/queries";
import { authRouter } from "~/modules/auth/server/controllers";

export const appRouter = router({
  transactions: {
    create: createTransactionProcuderu,
  },
  accounts: {
    create: publicProcedure
      .use((opts) => {
        if (!opts.ctx.user) {
          throw new TRPCError({
            message: "Unauthorized",
            code: "UNAUTHORIZED",
          });
        }

        return opts.next({ ctx: opts.ctx });
      })
      .input(
        z.object({
          name: z.string().min(1),
          defaultCurrency: z.nativeEnum(Currency),
        }),
      )
      .mutation(async ({ input, ctx }) => {
        const balance = {
          [input.defaultCurrency]: {
            amount: BigInt(0),
            currency: input.defaultCurrency,
            accuracy: 0,
          },
        };

        const account = (
          await db
            .insert(accounts)
            .values({
              balance: balance,
              name: input.name,
              defaultCurrency: input.defaultCurrency,
              userId: ctx.user!.id,
            })
            .returning()
        )[0];

        return account;
      }),
  },
  auth: authRouter,
  users: {
    create: publicProcedure.mutation(async () => {
      return await insertUser();
    }),
    getAll: publicProcedure.query(() => []),
  },
});

export type AppRouter = typeof appRouter;
