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

  loginWithGoogle() {
    this.store.dispatch(AuthActions.loginWithGoogle())
  }

  authorizeRequest() {
    this.store.dispatch(AuthActions.authorizeRequest())
  }
}
