import { map, OperatorFunction, pipe } from 'rxjs'

export function throwIfNull$Func<T>(
  source: string,
  typeName: string,
  ...objects: unknown[]
): OperatorFunction<T, NonNullable<T>> {
  return pipe(
    map((e) => {
      if (e === null || e === undefined) {
        const src = `${source}.throwIfNull`
        console.error(src, typeName, ...objects)
        throw new Error(objects.join(' '))
      }
      return e as NonNullable<T>
    }),
  )
}

export const throwIfNull$ = <T>(
  source: string,
  typeName: string,
  ...objects: unknown[]
): OperatorFunction<T, NonNullable<T>> => {
  return pipe(
    map((e) => {
      if (e === null || e === undefined) {
        const src = `${source}.throwIfNull`
        console.error(src, typeName, ...objects)
        throw new Error(objects.join(' '))
      }
      return e as NonNullable<T>
    }),
  )
}