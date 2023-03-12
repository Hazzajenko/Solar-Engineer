import { LoggerService } from './'
import { catchError, EMPTY, map, OperatorFunction, pipe, tap } from 'rxjs'

export class Logger {
  private logger: LoggerService
  source = this.constructor.name

  constructor(logger: LoggerService) {
    this.logger = logger
  }

  logDebug(...objects: unknown[]): void {
    const source =
      new Error().stack?.split('\n')[1].trim().split(' ')[1] ?? `${this.source}.logDebug`
    this.logger.debug(source, ...objects)
  }

  logError(...objects: unknown[]): void {
    const source =
      new Error().stack?.split('\n')[1].trim().split(' ')[1] ?? `${this.source}.logDebug`
    this.logger.error(source, ...objects)
    throw new Error(objects.join(' '))
  }

  throwIfNull<T>(value: T | null | undefined, ...objects: unknown[]): T {
    if (value === null || value === undefined) {
      const source =
        new Error().stack?.split('\n')[1].trim().split(' ')[1] ?? `${this.source}.throwIfNull`
      this.logger.error(source, value, ...objects)
      throw new Error(objects.join(' '))
    }
    return value
  }

  logDebug$<T>(source: string, model: string): OperatorFunction<T, T> {
    return tap((e: T) => {
      // e.constructor.name
      // const name = x.name
      /*      const source =
              new Error().stack?.split('\n')[1].trim().split(' ')[1] ?? `${this.source}.logDebug`*/
      this.logger.debug(source, model, e)
    })
  }

  logError$<T>(message?: string): OperatorFunction<T, T> {
    return tap((e) => {
      const source =
        new Error().stack?.split('\n')[1].trim().split(' ')[1] ?? `${this.source}.logDebug`
      this.logger.error(source, e, message)
    })
  }

  throwIfNull$<T>(...objects: unknown[]): OperatorFunction<T, NonNullable<T>> {
    return pipe(
      tap((e) => {
        if (e === null || e === undefined) {
          const source = `${this.source}.throwIfNull`
          this.logger.error(source, e, ...objects)
          throw new Error(objects.join(' '))
        }
      }),
      catchError((error) => {
        this.logError(error)
        return EMPTY
      }),
      map((e) => e as NonNullable<T>),
    )
  }

  /*  notNullSwitchMap<T, O extends ObservableInput<any>>(
      project: (value: T, index: number) => O
    ): OperatorFunction<T, ObservedValueOf<O>> {
      return (source) =>
        source.pipe(
          // this.throwIfNull$(),
          map((e) => e as T),
          // map((e) => this.throwIfNull(project(e))),
          // this.throwIfNull$()
        )
    }*/
}
