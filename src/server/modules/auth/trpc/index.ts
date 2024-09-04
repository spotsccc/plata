import { publicProcedure } from "~/server/trpc";
import { loginController, loginInput } from "../controllers/login";
import { registerController, registerInput } from "../controllers/register";

export const auth = {
  login: publicProcedure.input(loginInput).mutation(loginController),
  register: publicProcedure.input(registerInput).mutation(registerController),
};
