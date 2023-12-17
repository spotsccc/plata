import { ZodContract } from "@/shared/lib/zod-contract"
import { createJsonMutation, declareParams } from "@farfetched/core"
import {
  SubAccountCreateRequest,
  SubAccountCreateResponseSchema,
} from "api-contracts"

export const subAccountCreateMutation = createJsonMutation({
  params: declareParams<SubAccountCreateRequest>(),
  request: {
    url: () => "http://localhost:4000/api/sub-account",
    body: (req) => req,
    method: "POST",
    credentials: "include",
  },
  response: {
    contract: ZodContract({ schema: SubAccountCreateResponseSchema }),
  },
})
