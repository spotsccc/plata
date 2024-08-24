import {
  bigint,
  decimal,
  integer,
  jsonb,
  pgTable,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { InferModel, relations } from "drizzle-orm";
import { users } from "~/server/db/schemas";

export const accounts = pgTable("accounts", {
  id: bigint("id", { mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
  name: varchar("name", { length: 128 }).notNull(),
  userId: bigint("user_id", { mode: "number" })
    .references(() => users.id)
    .notNull(),
  balance: jsonb("balance").notNull(),
  defaultCurrency: varchar("default_currency", { length: 32 }).notNull(),
});
export const transactions = pgTable("transactions", {
  id: bigint("id", { mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
  accountId: bigint("account_id", { mode: "number" })
    .references(() => accounts.id)
    .notNull(),
  type: varchar("type", { length: 64 }).notNull(),
  amount: decimal("amount", { precision: 32, scale: 0 }).notNull(),
  accuracy: integer("accuracy").notNull(),
  currency: varchar("currency", { length: 32 }).notNull(),
  description: varchar("description", { length: 512 }),
  createdAt: timestamp("create_at", { withTimezone: true }).notNull(),

  category: varchar("category", { length: 64 }),

  receiverId: bigint("receiver_id", { mode: "number" }).references(
    () => accounts.id,
  ),
  receiveAmount: decimal("receive_amount", { precision: 32, scale: 0 }),
  receiveAccuracy: integer("receive_accuracy"),
  receiveCurrency: varchar("currency", { length: 32 }),
});

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

export const accountsRelations = relations(accounts, ({ one, many }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
  transactions: many(transactions),
}));

export type AccountSchema = InferModel<typeof accounts>;

export type TransactionSchema = InferModel<typeof transactions>;
