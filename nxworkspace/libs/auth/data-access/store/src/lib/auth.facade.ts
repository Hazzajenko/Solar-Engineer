import { tapResponse } from '@ngrx/component-store'
import { take } from 'rxjs'
import { inject, Injectable } from '@angular/core'
import { AuthService, SignInRequest, SignInResponse } from '@auth/data-access/api'
import { Store } from '@ngrx/store'
import { AuthActions } from './auth.actions'
import * as AuthSelectors from './auth.selectors'
import { StorageModel } from './storage.model'

@Injectable({
  providedIn: 'root',
})
export class AuthFacade {
  private readonly store = inject(Store)
  private readonly authService = inject(AuthService)
  isLoggedIn$ = this.store.select(AuthSelectors.isLoggedIn)
  user$ = this.store.select(AuthSelectors.selectUser)
  token$ = this.store.select(AuthSelectors.selectToken)

  init(req: SignInRequest) {
    this.store.dispatch(AuthActions.signIn({ req }))
  }

  isReturningUser() {
    const storage = localStorage.getItem('slreng-tk')
    if (storage) {
      const data: StorageModel = JSON.parse(storage)
      this.authService
        .validateUser(data.usr, data.eml, data.tkn)
        .pipe(
          take(1),
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
        )
        .subscribe((res) => console.log(res))
    }
  }
}
