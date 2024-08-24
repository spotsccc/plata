import { pgTable, bigint, timestamp, uuid } from "drizzle-orm/pg-core";
import { users } from "./user";
import { relations } from "drizzle-orm";

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
