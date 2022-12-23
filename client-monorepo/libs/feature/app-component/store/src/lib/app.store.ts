import {ComponentStore} from '@ngrx/component-store'
import {inject, Injectable} from '@angular/core'
import {Observable, switchMap, tap} from 'rxjs'
import {map} from 'rxjs/operators'
import {AuthStateActions} from "@auth/store";
import {AuthService, SignInRequest} from "@auth/api";
import {Store} from "@ngrx/store";
import {AppState} from "@shared/store";


interface AppComponentState {

}

@Injectable()
export class AppComponentStore extends ComponentStore<AppComponentState> {
  private authService = inject(AuthService)
  private store = inject(Store<AppState>)

  readonly signIn = this.effect((signInRequest$: Observable<SignInRequest>) =>
    signInRequest$.pipe(
      map((params) => params),
      switchMap((req) =>
        this.authService
          .signIn(req)
          .pipe(
            tap(user => {
              this.store.dispatch(AuthStateActions.addUserAndToken({user, token: user.token}))
            })
          )
      ),
    ),
  )

  constructor() {
    super({})
  }
}
