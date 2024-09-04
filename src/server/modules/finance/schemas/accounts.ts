import { bigint, jsonb, pgTable, varchar } from "drizzle-orm/pg-core";
import { InferModel } from "drizzle-orm";
import { users } from "../../users/schemas/user";

export const accounts = pgTable("accounts", {
  id: bigint("id", { mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
  name: varchar("name", { length: 128 }).notNull(),
  userId: bigint("user_id", { mode: "number" })
    .references(() => users.id)
    .notNull(),
  balance: jsonb("balance").notNull(),
  defaultCurrency: varchar("default_currency", { length: 32 }).notNull(),
});

export type AccountSchema = InferModel<typeof accounts>;
