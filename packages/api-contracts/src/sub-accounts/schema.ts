import { SubAccountSchema } from "models"
import { object } from "zod"

export const SubAccountCreateRequestSchema = SubAccountSchema.omit({
  id: true,
  creationDate: true,
})

export const SubAccountCreateResponseSchema = object({
  subAccount: SubAccountSchema,
})
