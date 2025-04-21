import { createFileRoute } from "@tanstack/react-router";
import { $accountId } from "../../../pages/account/model";
import { ctx } from "../../../ctx";
import { AccountPage } from "../../../pages/account/view";

export const Route = createFileRoute("/_auth-layout/accounts/$id")({
  component: AccountPage,
  loader: async ({ params }) => {
    ctx.run(() => $accountId(params.id));
  },
});
