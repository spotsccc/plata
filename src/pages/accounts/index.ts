import { allSettled, fork, serialize } from "effector";
import { GetServerSidePropsContext } from "next";
import { AccountsPage } from "~/client/pages/accounts/list";
import { pageStarted } from "~/client/pages/accounts/list/model";
import { createContextFromNext } from "~/server/context";
import { createCaller } from "~/server/trpc-router";

export default AccountsPage;

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const context = await createContextFromNext(ctx);
  const caller = createCaller(context);

  try {
    const res = await caller.finance.accounts.listPage();

    const scope = fork();

    await allSettled(pageStarted, {
      scope,
      params: { user: res.success.user!, accounts: res.success.accounts },
    });

    return {
      props: {
        values: serialize(scope),
      },
    };
  } catch (e) {
    return {
      redirect: {
        destination: "/auth/login",
      },
    };
  }
}
