import { doc, updateDoc, collection } from "firebase/firestore";
import { db } from "../../firebase";
import { Account } from "../../pages/accounts/model";

export async function updateAccount(userId: string, account: Account) {
  const col = collection(db, "users", userId, "accounts");
  const accountDoc = doc(col, account.id);
  await updateDoc(accountDoc, account);
}
