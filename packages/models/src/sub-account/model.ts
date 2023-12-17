import { AccountId } from "../account"
import { Money } from "../money"

export type SubAccountId = string
export type SubAccount = {
  accountId: AccountId
  id: SubAccountId
  total: Money
  name: string
  creationDate: string
}
