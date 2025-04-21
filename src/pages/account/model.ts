import { atom, computed, wrap, withAsyncData } from "@reatom/core";
import { Account } from "../accounts/model";
import { db } from "../../firebase";
import { collection, doc, getDoc } from "firebase/firestore";
import { $user } from "../../lib/auth/user";

export const $accountId = atom<string | null>(null);

export const $account = computed(async () => {
  const id = $accountId();

  if (!id) {
    return null;
  }
  const accountsRef = collection(db, "users", $user()?.uid ?? "", "accounts");

  const accountDoc = await wrap(getDoc(doc(accountsRef, id)));

  return { ...(accountDoc.data() as Account), id };
}).extend(withAsyncData());
