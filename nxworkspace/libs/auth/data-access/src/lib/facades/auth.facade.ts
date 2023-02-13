import { inject, Injectable } from '@angular/core'
import { AuthSelectors } from '../store'
import { Store } from '@ngrx/store'
import { AuthService as Auth0 } from '@auth0/auth0-angular'
import { of } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class AuthFacade {
  private store = inject(Store)
  // private auth0 = inject(Auth0)
  user$ = this.store.select(AuthSelectors.selectUser)
  isAuthenticated$ = of(true)
  // isAuthenticated$ = this.auth0.isAuthenticated$
}