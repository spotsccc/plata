import { ZodContract } from "@/shared/lib/zod-contract"
import { createJsonMutation, declareParams } from "@farfetched/core"
import {
  AccountCreateRequest,
  AccountCreateResponseSchema,
} from "api-contracts"

export const accountCreateMutation = createJsonMutation({
  params: declareParams<AccountCreateRequest>(),
  request: {
    url: "http://localhost:4000/api/account",
    method: "POST",
    body: (req) => req,
    credentials: "include",
  },
  response: {
    contract: ZodContract({ schema: AccountCreateResponseSchema }),
    status: { expected: 201 },
  },
})
