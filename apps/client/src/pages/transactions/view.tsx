import { sample } from "effector"
import { useUnit } from "effector-react"
import { format } from "date-fns"

import { transactionsRoute } from "@/shared/router"
import { getTransactionsQuery } from "@/shared/api/transactions/get-list"
import { CreateNewTransaction } from "@/features/transactions/create"
import {
  Transaction as TransactionT,
  TransactionType,
  TransactionIncome as TransactionIncomeT,
  TransactionExchange as TransactionExchangeT,
  TransactionExpense as TransactionExpenseT,
  Money,
} from "api-contracts"

sample({
  clock: transactionsRoute.opened,
  target: getTransactionsQuery.start,
})

export function TransactionsPage() {
  return (
    <div>
      <p>transactions</p>
      <CreateNewTransaction />
      <TransactionsList />
    </div>
  )
}

export function TransactionsList() {
  const { transactions } = useUnit({
    transactions: getTransactionsQuery.$data,
  })

  if (!transactions) {
    return null
  }

  return (
    <ul className="flex flex-col gap-3">
      {transactions.map((transaction) => (
        <Transaction key={transaction.id} transaction={transaction} />
      ))}
    </ul>
  )
}

export type TransactionProps = {
  transaction: TransactionT
}

export function Transaction({ transaction }: TransactionProps) {
  switch (transaction.type) {
    case TransactionType.income:
      return <TransactionIncome transaction={transaction} />
    case TransactionType.expense:
      return <TransactionExpense transaction={transaction} />
    case TransactionType.exchange:
      return <TransactionExchange transaction={transaction} />
    default:
      return null
  }
}

export type TransactionIncomeProps = {
  transaction: TransactionIncomeT
}

export function TransactionIncome({ transaction }: TransactionIncomeProps) {
  return (
    <li className="flex justify-between border-2 rounded-lg p-4">
      <p>{formatDate({ date: transaction.date })}</p>
      <p className="text-green-500">
        +{formatMoney({ money: transaction.value })}{" "}
      </p>
    </li>
  )
}

export type TransactionExpenseProps = {
  transaction: TransactionExpenseT
}

export function TransactionExpense({ transaction }: TransactionExpenseProps) {
  return (
    <li className="flex justify-between border-2 rounded-lg p-4 ">
      <p>{formatDate({ date: transaction.date })}</p>
      <p>{transaction.category}</p>
      <p className="text-red-500">
        -{formatMoney({ money: transaction.value })}
      </p>
    </li>
  )
}

export type TransactionExchangeProps = {
  transaction: TransactionExchangeT
}

export function TransactionExchange({ transaction }: TransactionExchangeProps) {
  return (
    <div className="flex justify-between border-2 rounded-lg p-4">
      <p>{formatDate({ date: transaction.date })}</p>
      <p className="text-green-500">
        +{formatMoney({ money: transaction.exchange })}
      </p>
      <p className="text-red-500">
        -{formatMoney({ money: transaction.value })}
      </p>
    </div>
  )
}

export function formatMoney({ money }: { money: Money }) {
  const amount = money.amount / 10 ** money.accuracy
  return `${amount} ${money.currency.code}`
}

export function formatDate({ date }: { date: string }) {
  return format(new Date(date), "yyyy-MM-dd HH-mm")
}
