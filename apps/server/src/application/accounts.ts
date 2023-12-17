import { SubAccount } from "@/domain/sub-account"
import { TransactionBase, TransactionExchange } from "@/domain/transaction"
import { Inject, Injectable } from "@nestjs/common"
import {
  AccountCreateRequest,
  AccountGetResponse,
  AccountsGetResponse,
  SubAccountCreateRequest,
  TransactionCreateRequest,
  TransactionCreateResponse,
  normilize,
} from "api-contracts"
import {
  Account,
  AccountId,
  SubAccountId,
  TransactionType,
  UserId,
} from "models"

export const ACCOUNTS_REPOSITORY = Symbol("ACCOUNTS_REPOSITORY")
export interface IAccountRepository {
  getListByUserId(x: { userId: string }): Promise<Array<Account>>
  insert(x: { data: AccountCreateRequest; userId: UserId }): Promise<Account>
  get(x: { accountId: AccountId }): Promise<Account>
}

export const SUB_ACCOUNTS_REPOSITORY = Symbol("SUB_ACCOUNT_REPOSITORY")
export interface ISubAccountsRepository {
  getListByAccountIds(x: { ids: Array<string> }): Promise<Array<SubAccount>>
  insert(x: { data: SubAccountCreateRequest }): Promise<SubAccount>
  getListByAccountId(x: { accountId: AccountId }): Promise<Array<SubAccount>>
  getById(x: { id: SubAccountId }): Promise<SubAccount>
  save(x: { subAccount: SubAccount }): Promise<SubAccount>
}

export const TRANSACTIONS_REPOSITORY = Symbol("TRANSACTIONS_REPOSITORY")
export interface ITransactionsRepository {
  /*getByUserId({ userId }: { userId: number }): Promise<Array<Transaction>>*/
  insert(x: { data: TransactionCreateRequest }): Promise<TransactionBase>
  getListBySubAccountIds(x: {
    ids: Array<string>
  }): Promise<Array<TransactionBase>>
}

@Injectable()
export class AccountService {
  constructor(
    @Inject(ACCOUNTS_REPOSITORY)
    private readonly accountRepository: IAccountRepository,
    @Inject(SUB_ACCOUNTS_REPOSITORY)
    private readonly subAccountRepository: ISubAccountsRepository,
    @Inject(TRANSACTIONS_REPOSITORY)
    private readonly transactionRepository: ITransactionsRepository,
  ) {}

  public async getList({
    userId,
  }: {
    userId: UserId
  }): Promise<AccountsGetResponse> {
    const accounts = await this.accountRepository.getListByUserId({ userId })
    const subAccounts = await this.subAccountRepository.getListByAccountIds({
      ids: accounts.map(({ id }) => id),
    })
    const transactions =
      await this.transactionRepository.getListBySubAccountIds({
        ids: subAccounts.map(({ id }) => id),
      })
    return {
      accounts: normilize(accounts),
      subAccounts: normilize(subAccounts.map((sb) => sb.json())),
      transactions: normilize(transactions.map((tr) => tr.json())),
    }
  }

  public async get({
    accountId,
  }: {
    accountId: AccountId
  }): Promise<AccountGetResponse> {
    const account = await this.accountRepository.get({ accountId })
    const subAccounts = await this.subAccountRepository.getListByAccountId({
      accountId,
    })
    const transactions =
      await this.transactionRepository.getListBySubAccountIds({
        ids: subAccounts.map(({ id }) => id),
      })

    return {
      account,
      subAccounts: normilize(subAccounts.map((sb) => sb.json())),
      transactions: normilize(transactions.map((tr) => tr.json())),
    }
  }

  public async create({
    data,
    userId,
  }: {
    data: AccountCreateRequest
    userId: UserId
  }): Promise<Account> {
    const account = await this.accountRepository.insert({ data, userId })
    return account
  }

  public async createSubAccount({
    data,
  }: {
    data: SubAccountCreateRequest
  }): Promise<SubAccount> {
    const subAccount = await this.subAccountRepository.insert({ data })
    return subAccount
  }

  public async createTransaction({
    data,
  }: {
    data: TransactionCreateRequest
  }): Promise<TransactionCreateResponse> {
    const transaction = await this.transactionRepository.insert({ data })
    let subAccount = await this.subAccountRepository.getById({
      id: transaction.subAccountId,
    })
    transaction.apply({ subAccount })
    subAccount = await this.subAccountRepository.save({ subAccount })

    if (transaction instanceof TransactionExchange) {
      let receiver = await this.subAccountRepository.getById({
        id: transaction.exchangeReceiver,
      })
      transaction.apply({ subAccount: receiver })
      receiver = await this.subAccountRepository.save({ subAccount: receiver })
      return {
        transaction: transaction.json(),
        subAccounts: [subAccount, receiver],
      }
    }

    return { transaction: transaction.json(), subAccounts: [subAccount] }
  }
}
