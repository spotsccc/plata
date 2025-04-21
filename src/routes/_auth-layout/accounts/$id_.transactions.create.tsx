import { createFileRoute } from "@tanstack/react-router";
import { ctx } from "../../../ctx";
import { pageOpened } from "../../../pages/account/transactions/create/model";
import { AccountTransactionCreate } from "../../../pages/account/transactions/create/view";
import { z } from "zod";

export const Route = createFileRoute(
  "/_auth-layout/accounts/$id_/transactions/create"
)({
  component: AccountTransactionCreate,
  validateSearch: z.object({
    type: z.enum(["income", "expense", "transfer"]).default("income"),
    step: z
      .enum(["currency", "amount", "category", "recepient", "final"])
      .default("currency"),
    amount: z.string().default(""),
    currency: z.string().default("USD"),
    category: z.string().default(""),
    recepient: z.string().default(""),
  }),
  onEnter: ({ params, search }) => {
    ctx.run(pageOpened, {
      ...search,
      id: params.id,
    });
  },
});
