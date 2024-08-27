import { publicProcedure } from "~/server/trpc";
import { saveAccessToken } from "../db/insert-access-token";
import { createError, createSuccess } from "~/shared/result";
import { registerInput } from "../../lib/inputs";
import { createUser } from "../../lib/create-user";
import { saveUser } from "~/modules/users/server/db/save-user";

export const register = publicProcedure
  .input(registerInput)
  .mutation(async ({ input, ctx }) => {
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
  });
