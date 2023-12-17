import { createJsonQuery, update } from "@farfetched/core"
import { AccountsGetResponseSchema } from "api-contracts"
import { create } from "mutative"

import { ZodContract } from "@/shared/lib/zod-contract"
import { subAccountCreateMutation } from "@/shared/api/sub-account/create"

import { accountCreateMutation } from "./create"
import { debug } from "patronum"

export const accountsGetQuery = createJsonQuery({
  request: {
    url: () => `http://localhost:4000/api/account`,
    method: "GET",
    credentials: "include",
  },
  initialData: {
    accounts: {
      ids: [],
      entities: {},
    },
    subAccounts: {
      ids: [],
      entities: {},
    },
    transactions: {
      ids: [],
      entities: {},
    },
  },
  response: {
    contract: ZodContract({ schema: AccountsGetResponseSchema }),
  },
})

debug(accountsGetQuery.finished.failure)

update(accountsGetQuery, {
  on: accountCreateMutation,
  by: {
    success({ mutation, query }) {
      if (query && "result" in query) {
        return create(query, (queryDraft) => {
          const newAccount = mutation.result.account
          queryDraft.result.accounts.ids.push(newAccount.id)
          queryDraft.result.accounts.entities[newAccount.id] = newAccount
        })
      }
      return {
        result: {
          accounts: {
            ids: [mutation.result.account.id],
            entities: {
              [mutation.result.account.id]: mutation.result.account,
            },
          },
          transactions: {
            ids: [],
            entities: {},
          },
          subAccounts: {
            ids: [],
            entities: {},
          },
        },
      }
    },
  },
})

update(accountsGetQuery, {
  on: subAccountCreateMutation,
  by: {
    success({ mutation, query }) {
      const newSubAccount = mutation.result.subAccount
      if (query && "result" in query) {
        return create(query, (queryDraft) => {
          queryDraft.result.subAccounts.ids.push(newSubAccount.id)
          queryDraft.result.subAccounts.entities[newSubAccount.id] =
            newSubAccount
        })
      }
      return {
        result: {
          accounts: {
            ids: [],
            entities: {},
          },
          transactions: {
            ids: [],
            entities: {},
          },
          subAccounts: {
            ids: [newSubAccount.id],
            entities: {
              [newSubAccount.id]: newSubAccount,
            },
          },
        },
      }
    },
  },
})
