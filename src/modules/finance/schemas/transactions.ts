import {
  bigint,
  decimal,
  integer,
  pgTable,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { accounts } from "./accounts";
import { InferModel } from "drizzle-orm";

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
  receiveCurrency: varchar("receive_currency", { length: 32 }),
});

export type TransactionSchema = InferModel<typeof transactions>;
