import { db } from "~/server/db";
import { toDatabase, fromDatabase } from "./mappers";
import { Transaction } from "../models/transaction";
import { transactions } from "../schemas/transactions";

export async function saveTransaction(
  transaction: Transaction,
): Promise<Transaction> {
  const mappedTransaction = toDatabase(transaction);
  console.log(mappedTransaction);
  console.log(
    db.insert(transactions).values(mappedTransaction).returning().toSQL(),
  );
  const insertedTransaction = (
    await db.insert(transactions).values(mappedTransaction).returning()
  )[0];
  return fromDatabase(insertedTransaction);
}
