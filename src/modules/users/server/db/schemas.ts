import { InferModel } from "drizzle-orm";
import { pgTable, bigint, varchar } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: bigint("id", { mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
  username: varchar("username", { length: 256 }).unique().notNull(),
  password: varchar("password", { length: 512 }).notNull(),
  email: varchar("email", { length: 100 }).unique().notNull(),
});

export type UserSchema = InferModel<typeof users>;
