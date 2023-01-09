import { inject, Injectable } from '@angular/core'
import { AuthService } from '@auth/data-access/api'
import { AuthActions, AuthSelectors } from '@auth/data-access/store'
import { SignInRequest, StorageModel } from '@auth/shared/models'
import { Store } from '@ngrx/store'

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

  register(req: SignInRequest) {
    this.store.dispatch(AuthActions.register({ req }))
  }

  isReturningUser() {
    const storage = localStorage.getItem('solarengineer-user')
    if (storage) {
      const userInStorage: StorageModel = JSON.parse(storage)
      this.store.dispatch(AuthActions.signInWithLocalstorage({ userInStorage }))
    }
  }
}
