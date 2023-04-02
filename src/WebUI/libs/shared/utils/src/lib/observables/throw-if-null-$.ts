import { catchError, EMPTY, map, OperatorFunction, pipe, retry } from 'rxjs'

/*import { operate } from 'rxjs/src/internal/util/lift'
 import { createOperatorSubscriber } from 'rxjs/src/internal/operators/OperatorSubscriber'*/

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

export const throwIfNull$Extended = <T>(
  source: string,
  typeName: string,
  ...objects: unknown[]
): OperatorFunction<T, NonNullable<T>> => {
  return pipe(
    map((e) => {
      if (e === null || e === undefined) {
        const err = [source, typeName, ...objects].join(' ')
        throw new Error(err)
      }
      return e as NonNullable<T>
    }),
    retry(3),
    catchError((err) => {
      // const src = `${source}.throwIfNull`
      // console.error(src, typeName, ...objects)
      console.warn(err)
      return EMPTY
      // throw err
    }),
  )
}
/*

 export function mapV2<T, R>(project: (value: T, index: number) => R, thisArg?: any): OperatorFunction<T, R> {
 return operate((source: { subscribe: (arg0: any) => void }, subscriber: { next: (arg0: R) => void }) => {
 // The index of the value from the source. Used with projection.
 let index = 0;
 // Subscribe to the source, all errors and completions are sent along
 // to the consumer.
 source.subscribe(
 createOperatorSubscriber(subscriber, (value: T) => {
 // Call the projection function with the appropriate this context,
 // and send the resulting value to the consumer.
 subscriber.next(project.call(thisArg, value, index++));
 })
 );
 });
 }
 */