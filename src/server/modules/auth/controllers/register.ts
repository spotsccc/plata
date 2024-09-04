import { z } from "zod";
import { Context } from "~/server/context";
import { publicProcedure } from "~/server/trpc";
import { createError, createSuccess } from "~/shared/result";
import { createUser } from "../../users/models/user";
import { saveUser } from "../../users/repositories/user";
import { saveAccessToken } from "../repositories/access-token";

export const registerInput = z
  .object({
    email: z.string().email(),
    password: z.string().min(8),
    username: z.string().min(1),
    repeatPassword: z.string().min(8),
  })
  .refine(
    ({ password, repeatPassword }) => {
      console.log(repeatPassword === password);
      return password === repeatPassword;
    },
    {
      message: "Password and repeat password are not same",
      path: ["password"],
    },
  );

export type RegisterInput = z.infer<typeof registerInput>;

type Request = {
  ctx: Context;
  input: RegisterInput;
};

export async function registerController({ ctx, input }: Request) {
  const user = createUser(input);
  try {
    const savedUser = await saveUser(user);
    const token = await saveAccessToken(savedUser.id!);

    ctx.setCookie("accessToken", token.token);

    return createSuccess(token);
  } catch (e) {
    if (e instanceof Error) {
      if ((e as any).constraint === "users_email_unique") {
        return createError({
          field: "email",
          message: "User with this email already exist",
        });
      } else if ((e as any).constraint === "users_username_unique") {
        return createError({
          field: "username",
          message: "User with this username already exist",
        });
      }
    }
    console.log(e);
    throw e;
  }
}

export const register = publicProcedure
  .input(registerInput)
  .mutation(async ({ input, ctx }) => {});
