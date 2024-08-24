import { allSettled, fork, serialize } from "effector";
import { GetServerSidePropsContext } from "next";
import { TransactionCreatePage } from "~/modules/finance/client/pages/transactions/create";
import { pageStarted } from "~/modules/finance/client/pages/transactions/create/model";
import { transactionCreateQuery } from "~/modules/finance/controllers/transaction/create";
import { createContextFromNext } from "~/server/context";
import { isError } from "~/shared/result";

export default TransactionCreatePage;

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const controllerContext = await createContextFromNext(ctx);
  const accountId = ctx.params!["id"] as string;
  console.log(controllerContext);
  const result = await transactionCreateQuery({
    ctx: controllerContext,
    input: { accountId: Number(accountId) },
  });

  if (isError(result)) {
    throw new Error("shrek");
  }

  const scope = fork();

  await allSettled(pageStarted, { scope, params: result.success });

  return {
    props: {
      values: serialize(scope),
    },
  };
}
