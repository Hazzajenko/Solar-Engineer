import { inject, Injectable } from '@angular/core'
import { AuthActions } from '@auth/data-access/store'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { NotificationsService } from 'libs/shared/data-access/notifications/src/lib/api'
import { map } from 'rxjs/operators'

@Injectable({
  providedIn: 'root',
})
export class NotificationsEffects {
  private actions$ = inject(Actions)
  private notificationsService = inject(NotificationsService)
  initConnections$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.signInSuccess),
        map(({ token }) =>
          this.notificationsService.createNotificationsConnection(token),
        ),
      ),
    { dispatch: false },
  )
}
