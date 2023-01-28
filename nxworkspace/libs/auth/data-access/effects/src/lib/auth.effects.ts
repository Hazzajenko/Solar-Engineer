import { HttpErrorResponse } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { AuthService } from '@auth/data-access/api'

import { AuthActions } from '@auth/data-access/store'
import { StorageModel } from '@auth/shared/models'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { Store } from '@ngrx/store'
import { ProjectsFacade } from '@projects/data-access/facades'
import { ProjectsActions } from '@projects/data-access/store'
import { ErrorModel, ValidationError } from '@shared/data-access/models'
import { catchError, map, of, switchMap, tap } from 'rxjs'

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions)
  private authService = inject(AuthService)
  private projectsService = inject(ProjectsFacade)
  success$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.signInSuccess),
      tap((action) => {
        const storage: StorageModel = {
          email: action.user.email,
          userName: action.user.userName,
          token: action.token,
        }
        localStorage.setItem('solarengineer-user', JSON.stringify(storage))
      }),
      map(() => ProjectsActions.initProjects()),
    ),
  )
  signInWithLocalStorage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.signInWithLocalstorage),
      switchMap(({ userInStorage }) =>
        this.authService.validateUser(userInStorage).pipe(
          map((response) =>
            AuthActions.signInSuccess({
              user: response.user,
              /*              user: {
                              userName: response.userName,
                              lastName: response.lastName,
                              firstName: response.firstName,
                              email: response.email,
                              created: response.created,
                              lastActive: response.lastActive,
                              photoUrl: response.photoUrl,
                            },*/
              token: response.token,
            }),
          ),
          catchError((error: Error) => of(AuthActions.signInError({ error: error.message }))),
        ),
      ),
    ),
  )
  init$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.signIn),
      switchMap(({ req }) =>
        this.authService.signIn(req).pipe(
          map((response) =>
            AuthActions.signInSuccess({
              user: response.user,
              /*              user: {
                              userName: response.userName,
                              lastName: response.lastName,
                              firstName: response.firstName,
                              email: response.email,
                              created: response.created,
                              lastActive: response.lastActive,
                              photoUrl: response.photoUrl,
                            },*/
              token: response.token,
            }),
          ),
          catchError((error: Error) => {
            console.log(error)

            return of(AuthActions.signInError({ error: error.message }))
          }),
        ),
      ),
    ),
  )

  register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.register),
      switchMap(({ req }) =>
        this.authService.register(req).pipe(
          map((response) =>
            AuthActions.signInSuccess({
              user: response.user,
              /*              user: {
                              userName: response.userName,
                              lastName: response.lastName,
                              firstName: response.firstName,
                              email: response.email,
                              created: response.created,
                              lastActive: response.lastActive,
                              photoUrl: response.photoUrl,
                            },*/
              token: response.token,
            }),
          ),
          catchError((error: HttpErrorResponse) => {
            const errors = error.error as ValidationError[]
            /*            const userNameErrors = errors.filter((error) => error.propertyName === 'Username')
                        const passwordErrors = errors.filter((error) => error.propertyName === 'Password')*/
            /*            console.log(userNameErrors)
                        console.log(passwordErrors)*/
            errors.forEach((error) => console.log(error.errorMessage))

            const errorMessages = errors.map((error) => {
              const errorMessage: ErrorModel = {
                property: error.propertyName,
                errorMessage: error.errorMessage,
              }
              return errorMessage
            })
            // error.error.forEach((x: ErrorModel) => console.log(x.errorMessage))

            // return of(ChatRoomsActions.signInError({ error: error.message }))
            return of(AuthActions.signInErrors({ errors: errorMessages }))
          }),
        ),
      ),
    ),
  )
}
