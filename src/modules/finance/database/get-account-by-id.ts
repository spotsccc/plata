import { db } from "~/server/db";
import { Account } from "../lib/model";

export async function getAccountById(id: number): Promise<Account | null> {
  return (
    ((await db.query.accounts.findFirst({
      where: (account, { eq }) => eq(account.id, id),
    })) as Account) ?? null
  );
}
