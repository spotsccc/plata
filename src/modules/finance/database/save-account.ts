import { db } from "~/server/db";
import { accounts } from "./schemas";
import { Account } from "../lib/model";

export async function saveAccount(account: Account): Promise<Account> {
  return (
    await db
      .insert(accounts)
      .values(account)
      .onConflictDoUpdate({ target: accounts.id, set: { ...account } })
      .returning()
      .then((accounts) =>
        accounts.map((account) => account as unknown as Account),
      )
  )[0];
}
