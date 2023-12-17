import { Normalized } from "../normilized"
import { Response } from "../response"
import { SubAccount, Transaction } from "models"

export type TransactionsGetResponse = Response<{
  transactions: Normalized<Transaction>
}>

export type TransactionCreateRequest = Omit<Transaction, "id" | "creationDate">
export type TransactionCreateResponse = Response<{
  transaction: Transaction
  subAccounts: Array<SubAccount>
}>

export type TransactionGetResponse = Response<{ transaction: Transaction }>

export {
  TransctionCreateRequestSchema,
  TransactionCreateResponseSchema,
} from "./schema"
