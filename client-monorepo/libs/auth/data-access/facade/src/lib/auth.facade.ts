import {inject, Injectable} from '@angular/core';
import {Store} from "@ngrx/store";
import {AppState} from "@shared/store";
import {isLoggedIn, selectToken, selectUser} from "@auth/store";
import {Observable} from "rxjs";
import {UserModel} from "@shared/models";

@Injectable({
  providedIn: 'root'
})
export class AuthFacade {
  private store = inject(Store<AppState>)

  user$: Observable<UserModel | undefined> = this.store.select(selectUser)
  token$: Observable<string | undefined> = this.store.select(selectToken)
  isLoggedIn$: Observable<boolean | undefined> = this.store.select(isLoggedIn)


}
