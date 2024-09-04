import type { CreateNextContextOptions } from "@trpc/server/adapters/next";
import { GetServerSidePropsContext } from "next";
import { getUserFromRequest } from "./modules/auth/get-user-from-request";

export async function createContext({ req, res }: CreateNextContextOptions) {
  const user = await getUserFromRequest(req);

  function setCookie(name: string, value: string) {
    res.setHeader(
      "set-cookie",
      `${name}=${value}; HttpOnly; Max-Age=86400; Path=/;`,
    );
  }

  return { user, setCookie };
}

export async function createContextFromNext(
  ctx: GetServerSidePropsContext,
): Promise<Context> {
  const user = await getUserFromRequest(ctx.req);

  function setCookie(name: string, value: string) {
    ctx.res.setHeader(
      "set-cookie",
      `${name}=${value}; HttpOnly; Max-Age=86400; Path=/;`,
    );
  }

  return { user, setCookie };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
