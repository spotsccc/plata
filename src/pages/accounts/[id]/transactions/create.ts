import { allSettled, fork, serialize } from "effector";
import { GetServerSidePropsContext } from "next";
import { TransactionCreatePage } from "~/modules/finance/client/pages/transactions/create";
import { pageStarted } from "~/modules/finance/client/pages/transactions/create/model";
import { createContextFromNext } from "~/server/context";
import { createCaller } from "~/server/trpc-router";

export default TransactionCreatePage;

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  try {
    const accountId = Number(ctx.params!.id);
    const context = await createContextFromNext(ctx);
    const caller = createCaller(context);

    const res = await caller.finance.transactions.createPage({ accountId });

    const scope = fork();

    await allSettled(pageStarted, { params: res, scope });

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
