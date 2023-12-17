import { createJsonMutation, declareParams } from "@farfetched/core"
import { runtypeContract } from "@farfetched/runtypes"
import { TransactionContract } from "./contracts"
import { TransactionCreateRequest } from "api-contracts"

export const createTransactionMutation = createJsonMutation({
  params: declareParams<{ transaction: TransactionCreateRequest }>(),
  request: {
    method: "POST",
    url: () => "http://localhost:4000/api/account/transaction",
    credentials: "include",
    body: ({ transaction }) => transaction,
  },
  response: {
    contract: runtypeContract(TransactionContract),
  },
})
