import { inject, Injectable } from '@angular/core'
import { SignInRequest } from '@auth/data-access/api'
import { Store } from '@ngrx/store'
import { AuthActions } from './auth.actions'
import * as AuthSelectors from './auth.selectors'

@Injectable({
  providedIn: 'root',
})
export class AuthFacade {
  private readonly store = inject(Store)
  isLoggedIn$ = this.store.select(AuthSelectors.isLoggedIn)
  user$ = this.store.select(AuthSelectors.selectUser)
  token$ = this.store.select(AuthSelectors.selectToken)

  init(req: SignInRequest) {
    this.store.dispatch(AuthActions.signIn({ req }))
  }
}
