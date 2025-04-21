import { getDocs, collection } from "firebase/firestore";
import { db } from "../../firebase";
import { Account } from "../../lib/finance/account";

export async function getAccounts(userId: string) {
  const accountsRef = collection(db, "users", userId, "accounts");

  const accountDocs = await getDocs(accountsRef);

  return accountDocs.docs.map((doc) => ({
    ...(doc.data() as Account),
    id: doc.id,
  }));
}
