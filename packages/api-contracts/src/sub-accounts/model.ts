import { Response } from "../response"
import { SubAccount } from "models"

export type SubAccountCreateRequest = Omit<SubAccount, "id" | "creationDate">
export type SubAccountCreateResponse = Response<{
  subAccount: SubAccount
}>
