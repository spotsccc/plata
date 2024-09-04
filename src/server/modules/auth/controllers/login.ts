import { hash } from "crypto";
import { createError, createSuccess } from "~/shared/result";
import { z } from "zod";
import { Context } from "~/server/context";
import { getUserByEmail } from "../../users/repositories/user";
import { saveAccessToken } from "../repositories/access-token";

export const loginInput = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export type LoginInput = z.infer<typeof loginInput>;

type Request = {
  input: LoginInput;
  ctx: Context;
};

export async function loginController({ input, ctx }: Request) {
  const user = await getUserByEmail(input.email);

  if (user?.password !== hash("sha256", input.password)) {
    return createError({ type: "Wrong email or password" });
  }

  const token = await saveAccessToken(user.id!);

  ctx.setCookie("accessToken", token.token);

  return createSuccess(token);
}
