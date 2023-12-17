import { ZodContract } from "@/shared/lib/zod-contract"
import { createJsonQuery, declareParams } from "@farfetched/core"
import { AccountGetResponseSchema } from "api-contracts"

export const accountGetQuery = createJsonQuery({
  params: declareParams<{ id: string }>(),
  request: {
    url: ({ id }) => `http://localhost:4000/api/account/${id}`,
    method: "GET",
    credentials: "include",
  },
  initialData: {
    account: { id: "", name: "", creationDate: "", userId: "" },
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
    contract: ZodContract({ schema: AccountGetResponseSchema }),
  },
})
