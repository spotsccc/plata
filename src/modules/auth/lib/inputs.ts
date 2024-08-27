import { z } from "zod";

export const loginInput = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export type LoginInput = z.infer<typeof loginInput>;

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
