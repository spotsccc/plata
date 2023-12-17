import { UserId } from "../user"

export type Account = {
  id: AccountId
  userId: UserId
  name: string
  creationDate: string
}

export type AccountId = string
