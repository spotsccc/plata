import { AccountId, SubAccountId, SubAccount as SubAccountModel } from "models"

import { Money } from "./money"

export class SubAccount {
  public id: SubAccountId
  public accountId: AccountId
  public name: string
  public total: Money
  public creationDate: string

  constructor({ id, accountId, name, total, creationDate }: SubAccountModel) {
    this.id = id
    this.accountId = accountId
    this.name = name
    this.total = new Money(total)
    this.creationDate = creationDate
  }

  public json(): SubAccountModel {
    return {
      id: this.id,
      accountId: this.accountId,
      name: this.name,
      total: this.total.json(),
      creationDate: this.creationDate,
    }
  }
}
