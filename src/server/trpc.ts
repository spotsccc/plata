import { initTRPC, TRPCError } from "@trpc/server";
import { ZodError } from "zod";
import { createContext } from "./context";
import { initConfig } from "./config";
import { initializeDatabase } from "./db";

const t = initTRPC.context<typeof createContext>().create({
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        validationError:
          error.code === "BAD_REQUEST" && error.cause instanceof ZodError
            ? error.cause.flatten()
            : null,
      },
    };
  },
});

export const publicProcedure = t.procedure;

export const router = t.router;

//@ts-ignore
BigInt.prototype.toJSON = function () {
  return this.toString();
};

export const authProcedure = publicProcedure.use((opts) => {
  if (!opts.ctx.user) {
    throw new TRPCError({
      message: "Unauthorized",
      code: "UNAUTHORIZED",
    });
  }

  return opts.next({ ctx: opts.ctx });
});

const config = initConfig();
initializeDatabase();
