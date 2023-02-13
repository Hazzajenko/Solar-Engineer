import { inject, Injectable } from '@angular/core'
import { MatSnackBar } from '@angular/material/snack-bar'
import { AuthActions } from '@auth/data-access/store'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { NotificationType } from '@shared/data-access/models'

import { map, switchMap } from 'rxjs/operators'
import { NotificationsService } from '../api'
import { NotificationsStoreService } from '../facades'
import { NotificationsActions } from '../store'

@Injectable({
  providedIn: 'root',
})
export class NotificationsEffects {
  private actions$ = inject(Actions)
  private notificationsService = inject(NotificationsService)
  private notificationsStore = inject(NotificationsStoreService)
  private snackBar = inject(MatSnackBar)
  initNotificationsConnection$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.signInSuccess),
        map(({ token }) => {
          // this.notificationsService.getAllUserNotifications()
          this.notificationsService.createNotificationsConnection(token)
        }),
      ),
    { dispatch: false },
  )

  initNotifications$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.signInSuccess),
        switchMap(
          () =>
            this.notificationsService.getAllUserNotifications().pipe(
              map((notifications) =>
                NotificationsActions.addManyNotifications({
                  notifications: notifications.notifications,
                }),
              ),
            ),
          // this.notificationsService.createNotificationsConnection(token)
        ),
      ),
    // { dispatch: false },
  )

  /*  addNotification$ = createEffect(
      () =>
        this.actions$.pipe(
          ofType(NotificationsActions.addNotification),
          map(({ notification }) => {
            const notificationFrom = notification.friendRequest.requestedByUserName
            this.snackBar.open(`New friend request from ${notificationFrom}!`, 'OK', {
              duration: 5000,
            })
          }),
        ),
      { dispatch: false },
    )*/

  /*
    updateNotification$ = createEffect(
      () =>
        this.actions$.pipe(
          ofType(NotificationsActions.updateOneNotification),
          switchMap(({ update }) =>
            this.notificationsService.updateNotification(update, NotificationType.FriendRequest),
          ),
        ),
      { dispatch: false },
    )
  */

  updateManyNotifications$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(NotificationsActions.updateManyNotifications),
        switchMap(({ updates }) => this.notificationsService.updateManyNotifications(updates)),
      ),
    { dispatch: false },
  )
}
