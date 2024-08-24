import { useUnit } from "effector-react";
import { $accounts } from "./model";

export function AccountsListPage() {
  const { accounts } = useUnit({ accounts: $accounts });
  return <div>{accounts.map((account) => account.name)}</div>;
}
