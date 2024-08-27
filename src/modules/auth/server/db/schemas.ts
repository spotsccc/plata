import { InferModel, relations } from "drizzle-orm";
import { pgTable, bigint, varchar, uuid, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: bigint("id", { mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
  username: varchar("username", { length: 256 }).unique().notNull(),
  password: varchar("password", { length: 512 }).notNull(),
  email: varchar("email", { length: 100 }).unique().notNull(),
});

export const accessTokens = pgTable("access_tokens", {
  token: uuid("token").primaryKey().defaultRandom(),
  userId: bigint("user_id", { mode: "number" })
    .references(() => users.id)
    .notNull(),
  expiresAt: timestamp("expires_at", {
    mode: "date",
    withTimezone: true,
  }).notNull(),
});

export const accessTokensRelation = relations(accessTokens, ({ one }) => ({
  user: one(users, {
    fields: [accessTokens.userId],
    references: [users.id],
  }),
}));

export type UserSchema = InferModel<typeof users>;

export type AccessTokenSchema = InferModel<typeof accessTokens>;
