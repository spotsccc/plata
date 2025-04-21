import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase";

export type Currency = {
  name: string;
};

export async function getCurrencies(search?: string) {
  const q = query(
    collection(db, "currencies"),
    where("name", ">=", search),
    where("name", "<=", search + "\uf8ff")
  );
  const currencies = await getDocs(q);
  return currencies.docs.map((doc) => doc.data()) as Array<Currency>;
}
