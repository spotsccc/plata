import { createJsonQuery } from "@farfetched/core"
import { TransactionContract } from "./contracts"
import { Array as ArrayContract } from "runtypes"
import { runtypeContract } from "@farfetched/runtypes"
import { Transaction } from "api-contracts"

export const getTransactionsQuery = createJsonQuery({
  request: {
    method: "GET",
    url: () => "http://localhost:4000/api/transactions",
    credentials: "include",
  },
  response: {
    contract: runtypeContract(ArrayContract(TransactionContract)),
    mapData: ({ result }) => {
      return result as Array<Transaction>
    },
  },
})
