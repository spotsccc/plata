import { bigint, jsonb, pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { users } from "./user";
import { InferModel, relations } from "drizzle-orm";
import { transactions } from "./transaction";

export const accounts = pgTable("accounts", {
  id: bigint("id", { mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
  name: varchar("name", { length: 128 }).notNull(),
  userId: bigint("user_id", { mode: "number" })
    .references(() => users.id)
    .notNull(),
  balance: jsonb("balance").notNull(),
  defaultCurrency: varchar("default_currency", { length: 32 }).notNull(),
});

export const accountsRelations = relations(accounts, ({ one, many }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
  transactions: many(transactions),
}));

export type Account = InferModel<typeof accounts>;
