import { Store } from '@ngrx/store'
import { selectAllNotifications, selectNotificationsEntities } from './notifications.selectors'
import { createRootServiceInjector } from '@shared/utils'
import { NotificationsActions } from './notifications.actions'
import { UpdateStr } from '@ngrx/entity/src/models'
import { NotificationModel } from '@auth/shared'

export function injectNotificationsStore(): NotificationsStore {
	return notificationsStoreInjector()
}

const notificationsStoreInjector = createRootServiceInjector(notificationsStoreFactory, {
	deps: [Store],
})

export type NotificationsStore = ReturnType<typeof notificationsStoreFactory>

function notificationsStoreFactory(store: Store) {
	const allNotifications = store.selectSignal(selectAllNotifications)
	const entities = store.selectSignal(selectNotificationsEntities)

	const select = {
		allNotifications,
		getById: (id: NotificationModel['id']) => entities()[id],
	}

	const dispatch = {
		loadNotifications: (notifications: NotificationModel[]) =>
			store.dispatch(NotificationsActions.loadNotifications({ notifications })),
		addNotification: (notification: NotificationModel) =>
			store.dispatch(NotificationsActions.addNotification({ notification })),
		addManyNotifications: (notifications: NotificationModel[]) =>
			store.dispatch(NotificationsActions.addManyNotifications({ notifications })),
		updateNotification: (update: UpdateStr<NotificationModel>) =>
			store.dispatch(NotificationsActions.updateNotification({ update })),
		updateManyNotifications: (updates: UpdateStr<NotificationModel>[]) =>
			store.dispatch(NotificationsActions.updateManyNotifications({ updates })),
		deleteNotification: (notificationId: NotificationModel['id']) =>
			store.dispatch(NotificationsActions.deleteNotification({ notificationId })),
		deleteManyNotifications: (notificationIds: NotificationModel['id'][]) =>
			store.dispatch(NotificationsActions.deleteManyNotifications({ notificationIds })),
		clearNotificationsState: () => store.dispatch(NotificationsActions.clearNotificationsState()),
	}

	return {
		select,
		dispatch,
	}
}
