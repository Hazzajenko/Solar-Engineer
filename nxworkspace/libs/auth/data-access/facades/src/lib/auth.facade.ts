import { inject, Injectable } from '@angular/core'
import { AuthService } from '@auth/data-access/api'
import { AuthActions, AuthSelectors } from '@auth/data-access/store'
import { SignInRequest, StorageModel } from '@auth/shared/models'
import { Store } from '@ngrx/store'
import { firstValueFrom } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class AuthFacade {
  private store = inject(Store)
  isLoggedIn$ = this.store.select(AuthSelectors.isLoggedIn)
  user$ = this.store.select(AuthSelectors.selectUser)
  token$ = this.store.select(AuthSelectors.selectToken)

  get user() {
    return firstValueFrom(this.user$)
  }
}
