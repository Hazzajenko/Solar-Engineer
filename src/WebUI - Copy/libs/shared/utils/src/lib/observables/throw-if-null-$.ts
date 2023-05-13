import { assertNotNull } from '../null';
import { catchError, EMPTY, map, OperatorFunction, pipe } from 'rxjs';


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

export const throwIfNull$ = <T>(): OperatorFunction<T, NonNullable<T>> => {
  return pipe(
    map((e) => {
      if (e === null || e === undefined) {
        throw new Error()
      }
      return e as NonNullable<T>
    }),
    catchError(() => EMPTY),
  )
}

// type NonNullable<T> = T extends null | undefined ? never : T
export type AllValuesNotNull<T> = {
  [K in keyof T]: NonNullable<T[K]>
}

export type OnePropertyNotNull<T, K extends keyof T> = {
  [P in keyof T]: P extends K ? NonNullable<T[P]> : T[P]
}

export const throwIfPropertyNull$ = <T, K extends keyof T>(
  property: K,
): OperatorFunction<T, OnePropertyNotNull<T, K>> => {
  return pipe(
    map((e) => {
      assertNotNull(e[property], `Property ${property.toString()} is null or undefined`)
      if (e[property] === null || e[property] === undefined) {
        throw new Error()
      }
      return {
        ...e,
        [property]: e[property] as NonNullable<T[K]>,
      } as OnePropertyNotNull<T, K>
    }),
    catchError(() => EMPTY),
  )
}

export const throwIfPropertyNull222$ = <T, K extends keyof T>(
  property: K,
): OperatorFunction<T, AllValuesNotNull<T>> => {
  return pipe(
    map((e) => {
      assertNotNull(e[property], `Property ${property.toString()} is null or undefined`)
      if (e[property] === null || e[property] === undefined) {
        throw new Error()
      }
      return {
        ...e,
        [property]: e[property] as NonNullable<T[K]>,
      } as AllValuesNotNull<T>
    }),
    catchError(() => EMPTY),
  )
}
/*export const throwIfPropertyNull$Deprecated = <T, K extends keyof T>(
 e: T,
 property: K,
 ): asserts property is NonNullable<T[K]>  => {
 pipe(
 map((e) => {
 assertNotNull(e[property], `Property ${property.toString()} is null or undefined`)
 if (e[property] === null || e[property] === undefined) {
 throw new Error()
 }

 /!*      return {
 ...e,
 [property]: e[property] as NonNullable<T[K]>,
 } as OnePropertyNotNull<T, K>*!/
 }),
 // catchError(() => EMPTY),
 )
 }*/

/*export const assertNotNull: <T>(value: T, message?: string) => asserts value is NonNullable<T> = <
 T,
 >(
 value: T,
 message?: string,
 ): void => {
 if (isNullish(value)) {
 console.error(message)
 throw new NullError(message)
 }
 }*/

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
    catchError((err) => {
      console.error(err)
      return EMPTY
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