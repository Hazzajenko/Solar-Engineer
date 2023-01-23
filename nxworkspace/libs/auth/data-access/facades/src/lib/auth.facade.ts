import { inject, Injectable } from '@angular/core'
import { AuthSelectors } from '@auth/data-access/store'
import { Store } from '@ngrx/store'
import { firstValueFrom } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class AuthFacade {
  private store = inject(Store)
  isLoggedIn$ = this.store.select(AuthSelectors.isLoggedIn)

  error$ = this.store.select(AuthSelectors.selectError)
  errors$ = this.store.select(AuthSelectors.selectErrors)
  user$ = this.store.select(AuthSelectors.selectUser)
  token$ = this.store.select(AuthSelectors.selectToken)

  get token() {
    return firstValueFrom(this.token$)
  }

  get user() {
    return firstValueFrom(this.user$)
  }
}
