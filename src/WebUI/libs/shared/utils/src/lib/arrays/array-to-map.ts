export const arrayToMap = <
  T extends
    | {
        id: string
      }
    | string,
>(
  items: readonly T[],
) => {
  return items.reduce((acc: Map<string, T>, element) => {
    acc.set(typeof element === 'string' ? element : element.id, element)
    return acc
  }, new Map())
}
