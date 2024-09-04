import { GetServerSidePropsContext } from "next";
import { AccountCreatePage } from "~/client/pages/accounts/create";
import { createContextFromNext } from "~/server/context";
import { createCaller } from "~/server/trpc-router";

export default AccountCreatePage;

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  try {
    const context = await createContextFromNext(ctx);
    const caller = createCaller(context);

    await caller.finance.accounts.createPage();

    return {
      props: {},
    };
  } catch (e) {
    return {
      redirect: {
        destination: "/auth/login",
      },
    };
  }
}
