import { map, pipe, tap } from 'rxjs'

export enum RxJsLoggingLevel {
  TRACE,
  DEBUG,
  INFO,
  ERROR,
}

let rxjsLoggingLevel = RxJsLoggingLevel.INFO

export function setRxJsLoggingLevel(level: RxJsLoggingLevel) {
  rxjsLoggingLevel = level
}

export function debug<T>(level: number, message: string) {
  return pipe(
    tap((val) => {
      if (level >= rxjsLoggingLevel) {
        console.log(message + ': ', val)
      }
    }),
    map((val) => val as T),
  )
}

/*export function log<T>(message?: string): OperatorFunction<T, T> {
  return tap(e => console.log(message, e));
}*/
/*export function log<T>(message?: string): OperatorFunction<T, T> {
  return function (source$: Observable<T>): Observable<T> {
    return new Observable<T>((observer) => {
      const wrapper = {
        next: (value: T | undefined) => {
          console.log(message, value)
          observer.next(value)
        },
        error: observer.error,
        complete: observer.complete,
      }
      return source$.subscribe(wrapper)
    })
  }
}*/

/*export function log<T>(message?: string): OperatorFunction<T, T> {
  return function(source$: Observable<T>): Observable<T> {
    return new Observable<T>(observer => {
      // ...
      observer.next('next value')
    });
  }
)*/

/*export const debug = (level: number, message: string) => (source: Observable<any>) =>
  source.pipe(
    tap((val) => {
      if (level >= rxjsLoggingLevel) {
        console.log(message + ': ', val)
      }
    }),
  )*/
