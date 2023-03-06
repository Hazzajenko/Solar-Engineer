import { inject, Injectable } from '@angular/core'
import { AuthSelectors } from '../store'
import { Store } from '@ngrx/store'
import { AuthService as Auth0 } from '@auth0/auth0-angular'
import { firstValueFrom, map, of } from 'rxjs'
import { throwExpression } from '@shared/utils'

@Injectable({
  providedIn: 'root',
})
export class AuthFacade {
  private store = inject(Store)
  // private auth0 = inject(Auth0)
  user$ = this.store.select(AuthSelectors.selectUser)
  user = firstValueFrom(this.user$)
  isLoggedIn$ = this.store.select(AuthSelectors.isLoggedIn)

  token$ = of(localStorage.getItem('token'))
  isAuthenticated$ = of(true)

  // isAuthenticated$ = this.auth0.isAuthenticated$

  async userId() {
    return await firstValueFrom(this.user$.pipe(map((user) => user?.id))) ?? throwExpression('User not logged in')
  }

  async isLoggedIn() {
    return await firstValueFrom(this.isLoggedIn$) ?? throwExpression('User not logged in')
  }
}
