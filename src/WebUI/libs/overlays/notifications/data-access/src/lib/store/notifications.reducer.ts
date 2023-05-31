import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity'
import { Action, createReducer, on, provideState } from '@ngrx/store'
import { ActionNotificationModel } from '../types'
import { NotificationsActions } from './notifications.actions'
import { Actions, createEffect, ofType, provideEffects } from '@ngrx/effects'
import { inject, makeEnvironmentProviders } from '@angular/core'
import { tap } from 'rxjs'
import { MatSnackBar } from '@angular/material/snack-bar'

export const NOTIFICATIONS_FEATURE_KEY = 'notifications'

export interface NotificationsState extends EntityState<ActionNotificationModel> {
	loaded: boolean
	error?: string | null
}

export const notificationsAdapter: EntityAdapter<ActionNotificationModel> =
	createEntityAdapter<ActionNotificationModel>({
		selectId: (notification) => notification.id,
	})

export const initialNotificationsState: NotificationsState = notificationsAdapter.getInitialState({
	loaded: false,
})

const reducer = createReducer(
	initialNotificationsState,
	on(NotificationsActions.addNotification, (state, { notification }) =>
		notificationsAdapter.addOne(notification, state),
	),
	on(NotificationsActions.addManyNotifications, (state, { notifications }) =>
		notificationsAdapter.addMany(notifications, state),
	),
	on(NotificationsActions.updateNotification, (state, { update }) =>
		notificationsAdapter.updateOne(update, state),
	),
	on(NotificationsActions.updateManyNotifications, (state, { updates }) =>
		notificationsAdapter.updateMany(updates, state),
	),
	on(NotificationsActions.deleteNotification, (state, { notificationId }) =>
		notificationsAdapter.removeOne(notificationId, state),
	),
	on(NotificationsActions.deleteManyNotifications, (state, { notificationIds }) =>
		notificationsAdapter.removeMany(notificationIds, state),
	),
	on(NotificationsActions.clearNotificationsState, () => initialNotificationsState),
)

export function notificationsReducer(state: NotificationsState | undefined, action: Action) {
	return reducer(state, action)
}

export function provideNotificationsFeature() {
	return makeEnvironmentProviders([
		provideState(NOTIFICATIONS_FEATURE_KEY, notificationsReducer),
		provideEffects({ displayNotification$ }),
	])
}

export const displayNotification$ = createEffect(
	(actions$ = inject(Actions), _snackBar = inject(MatSnackBar)) => {
		return actions$.pipe(
			ofType(NotificationsActions.addNotification),
			tap(({ notification }) => {
				_snackBar.open(notification.title, 'Ok', {
					horizontalPosition: 'start',
					verticalPosition: 'bottom',
					duration: 2000,
					direction: 'ltr',
					politeness: 'assertive',
				})
			}),
		)
	},
	{ functional: true, dispatch: false },
)
