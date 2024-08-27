import { publicProcedure } from "~/server/trpc";
import { hash } from "crypto";
import { saveAccessToken } from "../db/insert-access-token";
import { createError, createSuccess } from "~/shared/result";
import { loginInput } from "../../lib/inputs";
import { getUserByEmail } from "~/modules/users/server/db/get-user-by-email";

export const login = publicProcedure
  .input(loginInput)
  .mutation(async ({ input, ctx }) => {
    const user = await getUserByEmail(input.email);

    if (user?.password !== hash("sha512", input.password)) {
      return createError({ type: "Wrong email or password" });
    }

    const token = await saveAccessToken(user.id!);

    ctx.setCookie("accessToken", token.token);

    return createSuccess(token);
  });
