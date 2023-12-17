import { Contract } from "@farfetched/core"
import { ZodType, ParseReturnType, ZodError, TypeOf } from "zod"

export function ZodContract<T extends ZodType>({
  schema,
}: {
  schema: T
}): Contract<unknown, TypeOf<T>> {
  return {
    isData(data): data is ParseReturnType<T> {
      return schema.parse(data)
    },
    getErrorMessages(prepared: unknown) {
      const parsedError = prepared as unknown as ZodError
      return parsedError.issues.map(
        (issue) => `${issue.path.join(".")}: ${issue.message}`,
      )
    },
  }
}
