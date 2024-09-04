import { allSettled, fork, serialize } from "effector";
import { GetServerSidePropsContext } from "next";
import { Step } from "~/client/features/transaction/create/model";
import { TransactionCreatePage } from "~/client/pages/transactions/create";
import { pageStarted } from "~/client/pages/transactions/create/model";
import { createContextFromNext } from "~/server/context";
import { Currency } from "~/server/modules/finance/models/money";
import { TransactionType } from "~/server/modules/finance/models/transaction";
import { createCaller } from "~/server/trpc-router";
import { createSuccess, isError } from "~/shared/result";

export default TransactionCreatePage;

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  try {
    const accountId = Number(ctx.params!.id);
    const context = await createContextFromNext(ctx);
    const caller = createCaller(context);

    const res = await caller.finance.transactions.createPage({ accountId });

    if (isError(res)) {
      throw new Error("");
    }
    const scope = fork();

    const type = ctx.query["type"] as TransactionType;
    const step = ctx.query["step"] as Step;
    const currency = ctx.query["currency"] as Currency;
    const backUrl = ctx.query["backUrl"] as string;

    await allSettled(pageStarted, {
      params: createSuccess({ ...res.success, type, step, currency, backUrl }),
      scope,
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
