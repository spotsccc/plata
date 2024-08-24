import { db } from "~/server/db";
import { Transaction } from "../lib/model";
import { toDatabase, fromDatabase } from "./mappers";
import { transactions } from "./schemas";

export async function saveTransaction(
  transaction: Transaction,
): Promise<Transaction> {
  const mappedTransaction = toDatabase(transaction);
  const insertedTransaction = (
    await db
      .insert(transactions)
      .values(mappedTransaction)
      .onConflictDoUpdate({ target: transactions.id, set: mappedTransaction })
      .returning()
  )[0];
  return fromDatabase(insertedTransaction);
}
