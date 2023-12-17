import { Normalized } from "../normilized"
import { Response } from "../response"
import { Account, SubAccount, Transaction } from "models"

export type AccountCreateRequest = Omit<
  Account,
  "id" | "userId" | "creationDate"
>
export type AccountCreateResponse = Response<{
  account: Account
}>

export type AccountsGetResponse = Response<{
  accounts: Normalized<Account>
  subAccounts: Normalized<SubAccount>
  transactions: Normalized<Transaction>
}>

export type AccountGetResponse = Response<{
  account: Account
  subAccounts: Normalized<SubAccount>
  transactions: Normalized<Transaction>
}>

export {
  AccountCreateRequestSchema,
  AccountGetResponseSchema,
  AccountsGetResponseSchema,
  AccountCreateResponseSchema,
} from "./schema"
