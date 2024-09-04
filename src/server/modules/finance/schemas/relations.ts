import { accounts } from "./accounts";
import { relations } from "drizzle-orm";
import { transactions } from "./transactions";
import { users } from "../../users/schemas/user";

export const accountsRelations = relations(accounts, ({ one, many }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
  transactions: many(transactions),
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
  account: one(accounts, {
    fields: [transactions.accountId],
    references: [accounts.id],
  }),
  receiver: one(accounts, {
    fields: [transactions.receiverId],
    references: [accounts.id],
  }),
}));
