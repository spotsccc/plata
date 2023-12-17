import { object, string } from "zod"

export const AccountSchema = object({
  id: string().uuid(),
  name: string({ invalid_type_error: "Name should be number" }).min(
    3,
    "Name length should be more than 3",
  ),
  userId: string().uuid(),
  creationDate: string().datetime(),
})
