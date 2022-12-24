import { inject, Injectable } from '@angular/core'
import { AuthService, SignInRequest } from '@auth/data-access/api'
import { AuthActions } from '@auth/data-access/store'
import { ComponentStore } from '@ngrx/component-store'
import { Store } from '@ngrx/store'
import { AppState } from '@shared/data-access/store'
import { Observable, switchMap, tap } from 'rxjs'
import { map } from 'rxjs/operators'

interface store {
  token: string
}

@Injectable()
export class AppComponentStore extends ComponentStore<store> {
  private authService = inject(AuthService)
  private store = inject(Store<AppState>)

  readonly signIn = this.effect((signInRequest$: Observable<SignInRequest>) =>
    signInRequest$.pipe(
      map((params) => params),
      switchMap((req) =>
        this.authService.signIn(req).pipe(
          tap((user) => {
            this.store.dispatch(AuthActions.addUserAndToken({ user, token: user.token }))
          }),
        ),
      ),
    ),
  )

  constructor() {
    super()
  }
}
