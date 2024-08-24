import { allSettled, fork, serialize } from "effector";
import { GetServerSidePropsContext } from "next";
import { AccountsListPage } from "~/client/pages/accounts/list";
import { pageStarted } from "~/client/pages/accounts/list/model";
import { AccountsListController } from "~/server/page-controllers/accounts";

export default AccountsListPage;

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const result = await AccountsListController(ctx.req);

  if (result.tag === "unauthorized") {
    return {
      redirect: {
        destination: "/auth/login",
        permanent: false,
      },
    };
  }

  const scope = fork();

  await allSettled(pageStarted, {
    scope,
    params: { accounts: result.data.accounts, user: result.data.user },
  });

  return {
    props: {
      values: serialize(scope),
    },
  };
}
