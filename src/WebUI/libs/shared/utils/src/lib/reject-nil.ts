import { filter, OperatorFunction, pipe } from 'rxjs'

export function rejectNil<T>(): OperatorFunction<T, NonNullable<T>> {
  return pipe(filter((value): value is NonNullable<T> => value !== null && value !== undefined))
}
