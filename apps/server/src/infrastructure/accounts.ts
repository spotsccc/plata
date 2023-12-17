import { IAccountRepository } from "@/application/accounts"
import { AccountCreateRequest } from "api-contracts"
import { Knex } from "knex"
import { Account, AccountId, UserId } from "models"
import { InjectConnection } from "nest-knexjs"

const ALL = [
  "name as name",
  "creation_date as creationDate",
  "user_id as userId",
  "id as id",
]

export class AccountsRepository implements IAccountRepository {
  constructor(@InjectConnection() private readonly knex: Knex) {}

  public async get({ accountId }: { accountId: AccountId }): Promise<Account> {
    const [account] = await this.knex("accounts")
      .select(ALL)
      .where({ id: accountId })
    return account
  }

  public async insert({
    data,
    userId,
  }: {
    data: AccountCreateRequest
    userId: UserId
  }): Promise<Account> {
    await this.knex("accounts").insert({
      name: data.name,
      user_id: userId,
      creation_date: new Date().toISOString(),
    })
    const [account] = await this.knex("accounts")
      .select(ALL)
      .orderBy("creationDate", "desc")
      .limit(1)
    return account
  }

  public async getListByUserId({
    userId,
  }: {
    userId: string
  }): Promise<Account[]> {
    const accountsRaw = await this.knex("accounts")
      .select(ALL)
      .where({ user_id: userId })
    return accountsRaw
  }
}
