import {
  BaseTransaction as TransactionBaseModel,
  TransactionIncome as TransactionIncomeModel,
  TransactionExchange as TransactionExchangeModel,
  TransactionType,
  Transaction,
  TransactionExpense as TransactionExpenseModel,
  SubAccountId,
  BaseCategories,
  TransactionId,
} from "models"

import { Money } from "./money"
import { SubAccount } from "./sub-account"

export abstract class TransactionBase {
  public type = TransactionType.income
  public value: Money
  public creationDate: string
  public id: TransactionId
  public subAccountId: SubAccountId

  constructor({ value, creationDate, id, subAccountId }: TransactionBaseModel) {
    this.value = new Money(value)
    this.creationDate = creationDate
    this.id = id
    this.subAccountId = subAccountId
  }

  public abstract apply(_: { subAccount: SubAccount }): void
  public abstract json(): Transaction
}

export class TransactionIncome extends TransactionBase {
  public type: TransactionType.income

  constructor({ type, ...data }: TransactionIncomeModel) {
    super(data)
    this.type = type
  }

  public apply({ subAccount }: { subAccount: SubAccount }) {
    if (subAccount.id !== this.subAccountId) {
      throw new Error("Trying apply transaction to wrong subAccount")
    }
    subAccount.total.plus(this.value)
  }

  public json(): Transaction {
    return {
      id: this.id,
      type: this.type,
      value: this.value.json(),
      creationDate: this.creationDate,
      subAccountId: this.subAccountId,
    }
  }
}

export class TransactionExpense extends TransactionBase {
  public category: BaseCategories
  public type: TransactionType.expense

  constructor({ type, category, ...data }: TransactionExpenseModel) {
    super(data)
    this.type = type
    this.category = category
  }

  public apply({ subAccount }: { subAccount: SubAccount }) {
    if (subAccount.id !== this.subAccountId) {
      throw new Error("Trying apply transaction to wrong subAccount")
    }
    subAccount.total.minus(this.value)
  }

  public json(): Transaction {
    return {
      category: this.category,
      id: this.id,
      type: this.type,
      value: this.value.json(),
      creationDate: this.creationDate,
      subAccountId: this.subAccountId,
    }
  }
}

export class TransactionExchange extends TransactionBase {
  public type: TransactionType.exchange
  public exchange: Money
  public exchangeReceiver: SubAccountId

  constructor({
    type,
    exchange,
    exchangeReceiver,
    ...data
  }: TransactionExchangeModel) {
    super(data)
    this.type = type
    this.exchangeReceiver = exchangeReceiver
    this.exchange = new Money(exchange)
  }

  public apply({ subAccount }: { subAccount: SubAccount }) {
    if (subAccount.id === this.subAccountId) {
      subAccount.total.minus(this.value)
      return
    }
    if (subAccount.id === this.exchangeReceiver) {
      subAccount.total.plus(this.exchange)
      return
    }
    throw new Error("Trying apply transaction to wrong subAccount")
  }

  public json(): Transaction {
    return {
      exchangeReceiver: this.exchangeReceiver,
      exchange: this.exchange.json(),
      id: this.id,
      type: this.type,
      value: this.value.json(),
      creationDate: this.creationDate,
      subAccountId: this.subAccountId,
    }
  }
}
