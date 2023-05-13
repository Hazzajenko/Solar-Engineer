import { NotificationsActions } from './notifications.actions'
import { initialNotificationsState, NotificationsState } from './notifications.reducer'
import { selectAllNotifications, selectNotificationsState } from './notifications.selectors'
import { inject, Injectable } from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { UpdateStr } from '@ngrx/entity/src/models'
import { select, Store } from '@ngrx/store'
import { isNotNull } from '@shared/utils'
import { ActionNotificationModel } from '../types'

@Injectable({
	providedIn: 'root',
})
export class NotificationsStoreService {
	private readonly _store = inject(Store<NotificationsState>)
	private readonly _state$ = this._store.pipe(select(selectNotificationsState))
	private readonly _state = toSignal(this._state$, {
		initialValue: initialNotificationsState,
	})
	private _allNotifications$ = this._store.select(selectAllNotifications)
	readonly dispatch = new NotificationsRepository(this._store)
	notificationSignals = this._store.selectSignal(selectNotificationsState)

	get state() {
		return this._state()
	}

	get ids() {
		return this.state.ids
	}

	get entities() {
		return this.state.entities
	}

	get allNotifications$() {
		return this._allNotifications$
	}

	get allNotifications() {
		return this.state.ids.map((id) => this.entities[id]).filter(isNotNull)
	}

	getById(id: string) {
		return this.entities[id]
	}
}

class NotificationsRepository {
	constructor(private readonly _store: Store<NotificationsState>) {}

	addNotification(notification: ActionNotificationModel) {
		this._store.dispatch(NotificationsActions.addNotification({ notification }))
	}

	addManyNotifications(notifications: ActionNotificationModel[]) {
		this._store.dispatch(NotificationsActions.addManyNotifications({ notifications }))
	}

	updateNotification(update: UpdateStr<ActionNotificationModel>) {
		this._store.dispatch(NotificationsActions.updateNotification({ update }))
	}

	updateManyNotifications(updates: UpdateStr<ActionNotificationModel>[]) {
		this._store.dispatch(NotificationsActions.updateManyNotifications({ updates }))
	}

	deleteNotification(id: string) {
		this._store.dispatch(NotificationsActions.deleteNotification({ notificationId: id }))
	}

	deleteManyNotifications(ids: string[]) {
		this._store.dispatch(NotificationsActions.deleteManyNotifications({ notificationIds: ids }))
	}

	clearNotificationsState() {
		this._store.dispatch(NotificationsActions.clearNotificationsState())
	}
}
