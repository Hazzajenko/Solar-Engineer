import { Store } from '@ngrx/store'
import {
	selectAllNotifications,
	selectAmountOfUnreadNotifications,
	selectLocalNotifications,
	selectNotCompletedNotificationsSortedByCreatedTime,
	selectNotificationsEntities,
	selectNotificationsThatUserHasNotReceived,
} from './notifications.selectors'
import { createRootServiceInjector } from '@shared/utils'
import { NotificationsActions } from './notifications.actions'
import { UpdateStr } from '@ngrx/entity/src/models'
import { LocalNotificationModel, NotificationModel } from '@auth/shared'

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
		amountOfUnreadNotifications: store.selectSignal(selectAmountOfUnreadNotifications),
		notificationsThatUserHasNotReceived: store.selectSignal(
			selectNotificationsThatUserHasNotReceived,
		),
		notCompletedNotifications: store.selectSignal(
			selectNotCompletedNotificationsSortedByCreatedTime,
		),
		localNotifications: store.selectSignal(selectLocalNotifications),
	}

	const dispatch = {
		markNotificationsAsCompleted: (notificationIds: string[]) =>
			store.dispatch(NotificationsActions.markNotificationsAsCompleted({ notificationIds })),
		markManyNotificationsAsRead: (notificationIds: string[]) =>
			store.dispatch(NotificationsActions.markManyNotificationsAsRead({ notificationIds })),
		loadNotifications: (notifications: NotificationModel[]) =>
			store.dispatch(NotificationsActions.loadNotifications({ notifications })),
		addLocalNotification: (localNotification: LocalNotificationModel) =>
			store.dispatch(NotificationsActions.addLocalNotification({ localNotification })),
		deleteLocalNotification: (localNotificationId: LocalNotificationModel['id']) =>
			store.dispatch(NotificationsActions.deleteLocalNotification({ localNotificationId })),
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
