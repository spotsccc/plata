import {
  action,
  atom,
  computed,
  withAsync,
  withAsyncData,
  wrap,
} from "@reatom/core";
import { $user } from "../../lib/auth/user";
import { db } from "../../firebase";
import { addDoc, collection, getDocs } from "firebase/firestore";

export type Money = {
  amount: string;
  currency: string;
  accuracy: number;
};

export type Balance = Record<string, Money>;

export type Account = {
  id: string;
  name: string;
  defaultCurrency: string;
  balance: Balance;
};

export const $accounts = computed(async () => {
  const accountsRef = collection(db, "users", $user()?.uid ?? "", "accounts");
  const accountDocs = await wrap(getDocs(accountsRef));
  return accountDocs.docs.map(
    (doc) => ({ ...doc.data(), id: doc.id }) as Account
  );
}).extend(withAsyncData());

export type AccountBlank = Omit<Account, "id">;

export const createAccount = action(async (account: AccountBlank) => {
  const accountsRef = collection(db, "users", $user()?.uid ?? "", "accounts");
  await wrap(addDoc(accountsRef, account));
}).extend(withAsync());
