import { ITransactionsRepository } from "@/application/accounts"
import {
  TransactionBase,
  TransactionExchange,
  TransactionExpense,
  TransactionIncome,
} from "@/domain/transaction"
import { TransactionCreateRequest } from "api-contracts"
import { Knex } from "knex"
import {
  BaseCategories,
  BaseTransaction,
  CurrencyCode,
  TransactionType,
} from "models"
import { InjectConnection } from "nest-knexjs"

export type TransactionBaseRaw = {
  subAccountId: string
  creationDate: string
  id: string
  amount: string
  currencyCode: CurrencyCode
  accuracy: number
}

export type TransactionIncomeRaw = {
  type: TransactionType.income
} & TransactionBaseRaw

export type TransactionExchangeRaw = {
  type: TransactionType.exchange
  exchangeAmount: string
  exchangeAccuracy: number
  exchangeCurrencyCode: CurrencyCode
  exchangeReceiver: string
} & TransactionBaseRaw

export type TransactionExpenseRaw = {
  type: TransactionType.expense
  category: BaseCategories
} & TransactionBaseRaw

export type TransactionRaw =
  | TransactionExchangeRaw
  | TransactionIncomeRaw
  | TransactionExpenseRaw

const ALL = {
  subAccountId: "sub_account_id",
  exchangeAmount: "exchange_amount",
  exchangeAccuracy: "exchange_accuracy",
  exchangeCurrency: "exchange_currency_code",
  exchangeReceiver: "exchange_receiver",
  creationDate: "creation_date",
  id: "id",
  type: "type",
  category: "category",
  accuracy: "accuracy",
  amount: "amount",
  currencyCode: "currency",
}

export class TransactionsRepository implements ITransactionsRepository {
  constructor(@InjectConnection() private readonly knex: Knex) {}

  /*public async getByUserId({
    userId,
  }: {
    userId: number
  }): Promise<Transaction[]> {
    const rawTransactions = await this.knex("transactions")
      .select(
        "*",
        "user_id as userId",
        "exchange_amount as exchangeAmount",
        "exchange_accuracy as exchangeAccuracy",
        "exchange_currency as exchangeCurrency",
      )
      .where({ user_id: userId })
    return rawTransactions.map((raw) => this.mapRawTransaction({ raw }))
  }*/

  public async insert({
    data,
  }: {
    data: TransactionCreateRequest
  }): Promise<TransactionBase> {
    await this.knex("transactions").insert({
      sub_account_id: data.subAccountId,
      creation_date: new Date().toISOString(),
      type: data.type,
      amount: data.value.amount,
      currency: data.value.currency.code,
      accuracy: data.value.accuracy,
      category: (data as any).category,
      exchange_receiver: (data as any).exchangeReceiver,
      exchange_accuracy: (data as any).exchange?.accuracy,
      exchange_amount: (data as any).exchange?.amount,
      exchange_currency_code: (data as any).exchange?.currency.code,
    })
    const [rawTr] = await this.knex("transactions")
      .select(ALL)
      .orderBy("creation_date", "desc")
      .limit(1)
    if (!rawTr) {
      throw Error("")
    }
    return this.mapRawTransaction({ raw: rawTr })
  }

  public async getListBySubAccountIds({
    ids,
  }: {
    ids: string[]
  }): Promise<TransactionBase[]> {
    const transactionsRaw = await this.knex("transactions")
      .select(ALL)
      .whereIn("sub_account_id", ids)
      .orWhereIn("exchange_receiver", ids)
    return transactionsRaw.map((tr) => this.mapRawTransaction({ raw: tr }))
  }

  private mapRawTransaction({ raw }: { raw: TransactionRaw }): TransactionBase {
    const baseTransaction: BaseTransaction = {
      value: {
        amount: raw.amount,
        accuracy: raw.accuracy,
        currency: {
          code: raw.currencyCode,
        },
      },
      id: raw.id,
      creationDate: raw.creationDate,
      subAccountId: raw.subAccountId,
    }
    switch (raw.type) {
      case TransactionType.exchange:
        return new TransactionExchange({
          ...baseTransaction,
          type: TransactionType.exchange,
          exchange: {
            amount: raw.exchangeAmount,
            accuracy: raw.exchangeAccuracy,
            currency: {
              code: raw.exchangeCurrencyCode,
            },
          },
          exchangeReceiver: raw.exchangeReceiver,
        })
      case TransactionType.expense:
        return new TransactionExpense({
          ...baseTransaction,
          type: TransactionType.expense,
          category: raw.category,
        })
      case TransactionType.income:
      default:
        return new TransactionIncome({
          ...baseTransaction,
          type: TransactionType.income,
        })
    }
  }
}
