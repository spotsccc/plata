import { db } from "~/server/db";
import { accounts } from "../../schemas/accounts";
import { Account } from "../../models/account/account";
import { eq } from "drizzle-orm";

interface Omit {
  <T extends object, K extends [...(keyof T)[]]>(
    obj: T,
    ...keys: K
  ): {
    [K2 in Exclude<keyof T, K[number]>]: T[K2];
  };
}

const omit: Omit = (obj, ...keys) => {
  const ret = {} as {
    [K in keyof typeof obj]: (typeof obj)[K];
  };
  let key: keyof typeof obj;
  for (key in obj) {
    if (!keys.includes(key)) {
      ret[key] = obj[key];
    }
  }
  return ret;
};

export async function saveAccount(account: Account): Promise<Account> {
  if (account.id !== undefined) {
    return (
      await db
        .update(accounts)
        .set(omit(account, "id"))
        .where(eq(accounts.id, account.id))
        .returning()
        .then((accounts) =>
          accounts.map((account) => account as unknown as Account),
        )
    )[0];
  }

  return (
    await db
      .insert(accounts)
      .values(account)
      .returning()
      .then((accounts) =>
        accounts.map((account) => account as unknown as Account),
      )
  )[0];
}
