import { db } from "~/server/db";
import { Account } from "../lib/model";

export async function getAccounts(userId: number): Promise<Array<Account>> {
  const accounts = await db.query.accounts.findMany({
    where: (account, { eq }) => eq(account.userId, userId),
  });

  return accounts as Array<Account>;
}
