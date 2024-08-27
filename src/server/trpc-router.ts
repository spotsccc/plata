import { createTransactionProcuderu } from "~/modules/finance/controllers/transaction/create/trpc";
import { publicProcedure, router } from "./trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { Currency } from "~/modules/finance/lib/model";
import { db } from "./db";
import { accounts } from "~/modules/finance/database/schemas";
import { accessTokens, users } from "./db/schemas";
import { eq } from "drizzle-orm";
import dayjs from "dayjs";
import { hash } from "crypto";
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
  auth: {
    login: authRouter.login,
    register: publicProcedure
      .input(
        z
          .object({
            email: z.string().email(),
            password: z.string().min(8),
            username: z.string().min(1),
            repeatedPassword: z.string().min(8),
          })
          .refine(
            ({ password, repeatedPassword }) => {
              return password === repeatedPassword;
            },
            {
              message: "Password and repeated password is not the same",
              path: ["password"],
            },
          ),
      )
      .mutation(async ({ input, ctx }) => {
        const passwordHash = hash("sha512", input.password);
        try {
          const user = (
            await db
              .insert(users)
              .values({
                password: passwordHash,
                email: input.email,
                username: input.username,
              })
              .returning()
          )[0];

          const token = (
            await db
              .insert(accessTokens)
              .values({
                userId: user.id,
                expiresAt: dayjs().add(1, "d").toDate(),
              })
              .returning()
          )[0];

          ctx.setCookie("accessToken", token.token);

          return { tag: "success" as const, data: { user } };
        } catch (e) {
          return { tag: "error" as const, error: e };
        }
      }),
  },
  users: {
    create: publicProcedure.mutation(async () => {
      return await insertUser();
    }),
    getAll: publicProcedure.query(() => []),
  },
});

export type AppRouter = typeof appRouter;
