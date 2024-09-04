import { Pool } from "pg";
import { drizzle, NodePgDatabase } from "drizzle-orm/node-postgres";
import { config } from "../config";
import { users } from "../modules/users/schemas/user";
import {
  accountsRelations,
  transactionsRelations,
} from "../modules/finance/schemas/relations";
import { accounts } from "../modules/finance/schemas/accounts";
import { transactions } from "../modules/finance/schemas/transactions";
import {
  accessTokens,
  accessTokensRelation,
} from "../modules/auth/schemas/access-tokens";

export const schema = {
  users,
  accountsRelations,
  accounts,
  transactions,
  transactionsRelations,
  accessTokens,
  accessTokensRelation,
};

export let db: NodePgDatabase<typeof schema>;

export function initializeDatabase() {
  db = drizzle(
    new Pool({
      host: config.DB_HOST,
      user: config.DB_USERNAME,
      password: config.DB_PASSWORD,
      port: Number(config.DB_PORT),
      database: config.DB_NAME,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
      ...{
        ssl:
          config.ENV === "production"
            ? {
                rejectUnauthorized: false,
                requestCert: false,
              }
            : undefined,
      },
    }),
    {
      schema,
    },
  );
}
