export type Normalized<T> = {
  ids: Array<string>
  entities: Record<string, T>
}

export function normilize<T extends { id: string }>(
  entities: Array<T>,
): Normalized<T> {
  return {
    ids: entities.map(({ id }) => id),
    entities: entities.reduce(
      (acc, entity) => Object.assign(acc, { [entity.id]: entity }),
      {},
    ),
  }
}

export { NormilizedSchema } from "./schema"
