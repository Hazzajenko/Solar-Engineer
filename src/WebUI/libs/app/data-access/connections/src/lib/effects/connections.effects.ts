import { inject, Injectable } from '@angular/core'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { map } from 'rxjs/operators'
import { ConnectionsService } from '../api'
import { AuthActions } from '@auth/data-access'

@Injectable({
  providedIn: 'root',
})
export class ConnectionsEffects {
  private actions$ = inject(Actions)
  private connectionsService = inject(ConnectionsService)
  initConnections$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.signInSuccess),
        map(({ token }) => this.connectionsService.createHubConnection(token)),
      ),
    { dispatch: false },
  )
}