import { LoggerService } from './'
import { map, OperatorFunction, pipe, tap } from 'rxjs'
import { inject } from '@angular/core'
import { AuthFacade } from '@auth/data-access'

export class BaseService {
  protected logger = inject(LoggerService)
  protected authFacade = inject(AuthFacade)
  // private logger: LoggerService
  private source = this.constructor.name

  /*  constructor(logger: LoggerService) {
      this.logger = logger
    }*/

  protected user$ = this.authFacade.user$
  protected userName$ = this.authFacade.user$.pipe(
    map((user) => user?.userName ?? 'User not logged in'),
  )
  protected currentUserId = this.authFacade.userId()
  protected isLoggedIn$ = this.authFacade.isLoggedIn$
  // protected user = async () => await this.authFacade.user

  /*  currentUserId() {

    }*/

  /*  protected async user() {
      return await firstValueFrom(this.authFacade.user$)
    }*/

  protected logDebug(...objects: unknown[]): void {
    const source =
      new Error().stack?.split('\n')[1].trim().split(' ')[1] ?? `${this.source}.logDebug`
    this.logger.debug(source, ...objects)
  }

  protected logError(...objects: unknown[]): void {
    const source =
      new Error().stack?.split('\n')[1].trim().split(' ')[1] ?? `${this.source}.logDebug`
    this.logger.error(source, ...objects)
    throw new Error(objects.join(' '))
  }

  protected throwIfNull<T>(value: T | null | undefined, ...objects: unknown[]): T {
    if (value === null || value === undefined) {
      const source =
        new Error().stack?.split('\n')[1].trim().split(' ')[1] ?? `${this.source}.throwIfNull`
      this.logger.error(source, value, ...objects)
      throw new Error(objects.join(' '))
    }
    return value
  }

  protected logDebug$<T>(source: string, model: string): OperatorFunction<T, T> {
    return tap((e: T) => {
      // e.constructor.name
      // const name = x.name
      /*      const source =
              new Error().stack?.split('\n')[1].trim().split(' ')[1] ?? `${this.source}.logDebug`*/
      this.logger.debug(source, model, e)
    })
  }

  protected logError$<T>(message?: string): OperatorFunction<T, T> {
    return tap((e) => {
      const source =
        new Error().stack?.split('\n')[1].trim().split(' ')[1] ?? `${this.source}.logDebug`
      this.logger.error(source, e, message)
    })
  }

  protected throwIfNull$<T>(
    typeName: string,
    ...objects: unknown[]
  ): OperatorFunction<T, NonNullable<T>> {
    return pipe(
      map((e) => {
        if (e === null || e === undefined) {
          const source = `${this.source}.throwIfNull`
          this.logger.error(source, typeName, ...objects)
          throw new Error(objects.join(' '))
          // e.constructor.name
        }
        /* e.constructor.name*/
        // return e
        return e as NonNullable<T>
      }),
      /*     tap((e) => {
             if (e === null || e === undefined) {
               const source = `${this.source}.throwIfNull`
               this.logger.error(source, e, ...objects)
               throw new Error(objects.join(' '))
             }
           }),
           // retry(2),
           /!*      retryWhen((errors) => {
                   return errors.pipe(tap(() => console.log('retrying...')))
                 }),*!/
           /!*      catchError((error) => {
                   this.logError(error)
                   return EMPTY
                 }),*!/
           map((e) => e as NonNullable<T>),*/
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
