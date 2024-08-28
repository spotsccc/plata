import { allSettled, fork, serialize } from "effector";
import { GetServerSidePropsContext } from "next";
import { AccountsPage } from "~/modules/finance/client/pages/accounts/list";
import { pageStarted } from "~/modules/finance/client/pages/accounts/list/model";
import { AccountsListController } from "~/modules/finance/controllers/accounts/list";
import { isError } from "~/shared/result";

export default AccountsPage;

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const res = await AccountsListController(ctx.req);

  if (isError(res)) {
    return {
      redirect: {
        destination: "/auth/login",
      },
    };
  }

  const scope = fork();

  await allSettled(pageStarted, { scope, params: res.success });

  return {
    props: {
      values: serialize(scope),
    },
  };
}
