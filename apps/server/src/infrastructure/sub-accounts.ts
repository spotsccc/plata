import { SubAccountCreateRequest } from "api-contracts"
import { Knex } from "knex"
import { AccountId, CurrencyCode, SubAccountId } from "models"
import { InjectConnection } from "nest-knexjs"

import { ISubAccountsRepository } from "@/application/accounts"
import { SubAccount } from "@/domain/sub-account"

const ALL = {
  accountId: "account_id",
  totalAmount: "total_amount",
  totalAccuracy: "total_accuracy",
  totalCurrencyCode: "total_currency_code",
  name: "name",
  creationDate: "creation_date",
  id: "id",
}

export type RawSubAccount = {
  accountId: AccountId
  totalAmount: string
  totalAccuracy: number
  totalCurrencyCode: CurrencyCode
  name: string
  creationDate: string
  id: SubAccountId
}

export class SubAccountsRepository implements ISubAccountsRepository {
  constructor(@InjectConnection() private readonly knex: Knex) {}

  public async getById({ id }: { id: string }): Promise<SubAccount> {
    const [subAccountRaw] = await this.knex("sub_accounts")
      .select(ALL)
      .where({ id })
    return this.mapRawSubAccount({ subAccountRaw })
  }

  public async save({
    subAccount,
  }: {
    subAccount: SubAccount
  }): Promise<SubAccount> {
    await this.knex("sub_accounts")
      .update({
        total_amount: subAccount.total.amount,
        total_accuracy: subAccount.total.accuracy,
        name: subAccount.name,
      })
      .where({ id: subAccount.id })
    return this.getById({ id: subAccount.id })
  }

  public async getListByAccountId({
    accountId,
  }: {
    accountId: AccountId
  }): Promise<SubAccount[]> {
    const subAccountsRaw = await this.knex("sub_accounts").select(ALL).where({
      account_id: accountId,
    })
    return subAccountsRaw.map((sa) =>
      this.mapRawSubAccount({ subAccountRaw: sa }),
    )
  }

  public async insert({
    data,
  }: {
    data: SubAccountCreateRequest
  }): Promise<SubAccount> {
    await this.knex("sub_accounts").insert({
      account_id: data.accountId,
      creation_date: new Date().toISOString(),
      total_amount: data.total.amount,
      total_accuracy: data.total.accuracy,
      total_currency_code: data.total.currency.code,
      name: data.name,
    })
    const [subAccountRaw] = await this.knex("sub_accounts")
      .select(ALL)
      .orderBy("creationDate", "desc")
      .limit(1)
    return this.mapRawSubAccount({ subAccountRaw })
  }

  public async getListByAccountIds({
    ids,
  }: {
    ids: string[]
  }): Promise<SubAccount[]> {
    const subAccountsRaw = await this.knex("sub_accounts")
      .select(ALL)
      .whereIn("account_id", ids)
    return subAccountsRaw.map((subAccountRaw) =>
      this.mapRawSubAccount({ subAccountRaw }),
    )
  }

  private mapRawSubAccount({
    subAccountRaw,
  }: {
    subAccountRaw: RawSubAccount
  }): SubAccount {
    return new SubAccount({
      name: subAccountRaw.name,
      creationDate: subAccountRaw.creationDate,
      accountId: subAccountRaw.accountId,
      id: subAccountRaw.id,
      total: {
        amount: subAccountRaw.totalAmount,
        accuracy: subAccountRaw.totalAccuracy,
        currency: {
          code: subAccountRaw.totalCurrencyCode,
        },
      },
    })
  }
}
