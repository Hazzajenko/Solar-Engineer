import { inject, Injectable } from '@angular/core'
import { AuthService, SignInResponse } from '@auth/data-access/api'

import { tapResponse } from '@ngrx/component-store'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { Store } from '@ngrx/store'
import { ProjectsFacade } from '@projects/data-access/store'
import { AppState } from '@shared/data-access/store'
import { switchMap, tap } from 'rxjs'
import { AuthActions } from './auth.actions'

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions)
  private authService = inject(AuthService)
  private projectsService = inject(ProjectsFacade)
  success$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.signInSuccess),
        tap(() => this.projectsService.init()),
      ),
    { dispatch: false },
  )
  private store = inject(Store<AppState>)
  init$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.signIn),
        switchMap(({ req }) =>
          this.authService.signIn(req).pipe(
            tapResponse(
              (response: SignInResponse) =>
                this.store.dispatch(
                  AuthActions.signInSuccess({
                    user: {
                      username: response.username,
                      lastName: response.lastName,
                      firstName: response.firstName,
                      email: response.email,
                    },
                    token: response.token,
                  }),
                ),
              (error: Error) =>
                this.store.dispatch(AuthActions.signInError({ error: error.message })),
            ),
          ),
        ),
      ),
    { dispatch: false },
  )
}
