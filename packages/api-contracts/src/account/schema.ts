import { NormilizedSchema } from "../normilized"
import { AccountSchema, SubAccountSchema, TransactionSchema } from "models"
import { object, string } from "zod"

export const AccountCreateRequestSchema = AccountSchema.omit({
  id: true,
  userId: true,
  creationDate: true,
})

export const AccountCreateResponseSchema = object({
  account: AccountSchema,
})

export const AccountGetResponseSchema = object({
  account: AccountSchema,
  subAccounts: NormilizedSchema({ key: string(), value: SubAccountSchema }),
  transactions: NormilizedSchema({ key: string(), value: TransactionSchema }),
})

export const AccountsGetResponseSchema = object({
  accounts: NormilizedSchema({ key: string(), value: AccountSchema }),
  subAccounts: NormilizedSchema({ key: string(), value: SubAccountSchema }),
  transactions: NormilizedSchema({ key: string(), value: TransactionSchema }),
})
