import { authProcedure } from "~/server/trpc";
import {
  accountCreateController,
  accountCreateInput,
} from "../controllers/accounts/create";
import { z } from "zod";
import { AccountsListPageController } from "../controllers/accounts/list";
import {
  transactionCreateController,
  transactionCreateInput,
} from "../controllers/transactions/create";
import {
  transactionCreatePageController,
  transactionCreatePageInput,
} from "../controllers/transactions/createPage";

export const finance = {
  accounts: {
    create: authProcedure
      .input(accountCreateInput)
      .mutation(accountCreateController),
    listPage: authProcedure.input(z.void()).query(AccountsListPageController),
    createPage: authProcedure.input(z.void()).query(() => ({})),
  },
  transactions: {
    create: authProcedure
      .input(transactionCreateInput)
      .mutation(transactionCreateController),
    createPage: authProcedure
      .input(transactionCreatePageInput)
      .query(transactionCreatePageController),
  },
};
