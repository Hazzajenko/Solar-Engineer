import { inject, Injectable } from '@angular/core'
import { AuthActions } from '../store'
import { Store } from '@ngrx/store'

@Injectable({
  providedIn: 'root',
})
export class AuthRepository {
  private store = inject(Store)

  login() {
    this.store.dispatch(AuthActions.login())
  }

  signInSuccess(token: string) {
    this.store.dispatch(AuthActions.signInSuccess({ token }))
  }

  loginWithGoogle() {
    this.store.dispatch(AuthActions.loginWithGoogle())
  }

  authorizeRequest() {
    this.store.dispatch(AuthActions.authorizeRequest())
  }

  isReturningUser() {
    this.store.dispatch(AuthActions.isReturningUser())
  }

  signOut() {
    // TODO implement signOut
    this.store.dispatch(AuthActions.signOut())
  }
}
