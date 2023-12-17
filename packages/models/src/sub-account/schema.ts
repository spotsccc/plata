import { MoneySchema } from "../money"
import { object, string } from "zod"

export const SubAccountSchema = object({
  id: string().uuid(),
  name: string({ invalid_type_error: "Name should be number" }).min(
    3,
    "Name length should be more than 3",
  ),
  total: MoneySchema,
  accountId: string().uuid(),
  creationDate: string().datetime(),
})
