import { inject, Injectable } from '@angular/core'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { Store } from '@ngrx/store'
import { NotificationsActions } from '../store'
import { map, switchMap, tap } from 'rxjs'
import { AuthActions } from '@auth/data-access/store'
import { NotificationsService } from '../api'
import { NotificationsSignalrService } from '../api/notifications-signalr.service'

@Injectable({
  providedIn: 'root',
})
export class NotificationsEffects {
  private actions$ = inject(Actions)
  private store = inject(Store)
  private notificationsService = inject(NotificationsService)
  private notificationsSignalR = inject(NotificationsSignalrService)

  initNotifications$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.signInSuccess),
      tap(({ token }) => this.notificationsSignalR.createNotificationsConnection(token)),
      switchMap(() =>
        this.notificationsService
          .getNotifications()
          .pipe(
            map(({ notifications }) =>
              NotificationsActions.addManyNotifications({ notifications }),
            ),
          ),
      ),
    ),
  )

  /*
  readNotification$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NotificationsActions.readNotification),
      switchMap(({ notificationId }) =>
        this.usersService
          .getUserByUserNameV2(userName)
          .pipe(map((res) => NotificationsActions.addUser({ user: res.user }))),
      ),
    ),
  )
*/
}
