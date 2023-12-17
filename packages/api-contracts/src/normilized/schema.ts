import { ZodTypeAny, array, record, object } from "zod"

export function NormilizedSchema<
  Key extends ZodTypeAny = ZodTypeAny,
  Value extends ZodTypeAny = ZodTypeAny,
>({ key, value }: { key: Key; value: Value }) {
  return object({
    ids: array(key),
    entities: record(key, value),
  })
}
