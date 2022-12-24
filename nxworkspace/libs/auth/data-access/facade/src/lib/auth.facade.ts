import { inject, Injectable } from '@angular/core'
import { isLoggedIn, selectToken, selectUser } from '@auth/data-access/store'
import { Store } from '@ngrx/store'
import { UserModel } from '@shared/data-access/models'
import { AppState } from '@shared/data-access/store'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class AuthFacade {
  private store = inject(Store<AppState>)

  user$: Observable<UserModel | undefined> = this.store.select(selectUser)
  token$: Observable<string | undefined> = this.store.select(selectToken)
  isLoggedIn$: Observable<boolean | undefined> = this.store.select(isLoggedIn)
}
