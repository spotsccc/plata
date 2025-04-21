import { collection, doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";

import { Account } from "../../pages/accounts/model";

export async function getAccount(userId: string, id: string): Promise<Account> {
  const accountsRef = collection(db, "users", userId, "accounts");

  const accountDoc = await getDoc(doc(accountsRef, id));

  return { ...accountDoc.data(), id } as Account;
}
