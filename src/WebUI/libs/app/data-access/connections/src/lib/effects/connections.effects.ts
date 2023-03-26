import { inject, Injectable } from '@angular/core'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { map } from 'rxjs/operators'
import { ConnectionsSignalrService } from '../api'
import { AuthActions } from '@auth/data-access'

@Injectable({
  providedIn: 'root',
})
export class ConnectionsEffects {
  private actions$ = inject(Actions)
  private connectionsService = inject(ConnectionsSignalrService)
  /*  initConnections$ = createEffect(
   () =>
   this.actions$.pipe(
   ofType(AuthActions.signInSuccess),
   map(({ token }) => this.connectionsService.createHubConnection(token)),
   ),
   { dispatch: false },
   )*/

  initConnections$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.signInFetchUserSuccess),
        map(({ token }) => this.connectionsService.createHubConnection(token)),
      ),
    { dispatch: false },
  )
}
