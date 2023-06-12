import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core'
import {
	DatePipe,
	NgClass,
	NgForOf,
	NgIf,
	NgOptimizedImage,
	NgStyle,
	NgTemplateOutlet,
} from '@angular/common'
import { InputSvgComponent, ShowSvgNoStylesComponent } from '@shared/ui'
import { injectAuthStore, injectUsersStore } from '@auth/data-access'
import { injectNotificationsStore } from '@overlays/notifications/data-access'
import { NOTIFICATION_TYPE, NotificationModel } from '@auth/shared'
import { TruncatePipe } from '@shared/pipes'
import { LetDirective } from '@ngrx/component'
import {
	getContentMessageBasedOnType,
	getContentMessageBasedOnTypeWithoutDisplayName,
	getContentMessageHtmlBasedOnType,
	getNotificationTypeToText,
} from '@auth/utils'
import { CenterThisElementDirective, DefaultHoverEffectsDirective } from '@shared/directives'
import { notification } from '@tauri-apps/api'
import { ToSafeHtmlPipe } from '@shared/utils'
import { heightInOutWithConfig } from '@shared/animations'

@Component({
	selector: 'side-ui-notifications-view',
	standalone: true,
	imports: [
		NgForOf,
		ShowSvgNoStylesComponent,
		NgIf,
		NgClass,
		NgStyle,
		TruncatePipe,
		NgOptimizedImage,
		NgTemplateOutlet,
		LetDirective,
		DatePipe,
		InputSvgComponent,
		CenterThisElementDirective,
		ToSafeHtmlPipe,
		DefaultHoverEffectsDirective,
	],
	templateUrl: './side-ui-notifications-view.component.html',
	styles: [],
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [heightInOutWithConfig(0.1)],
})
export class SideUiNotificationsViewComponent {
	private _authStore = injectAuthStore()
	private _usersStore = injectUsersStore()
	private _notificationsStore = injectNotificationsStore()
	user = this._authStore.select.user
	notifications = this._notificationsStore.select.allNotifications
	selectedNotificationId = signal<string | undefined>(undefined)
	openedNotifications = signal<Map<string, boolean>>(new Map())

	multiSelectedNotificationIds = signal<string[]>([])
	allNotificationsSelected = computed(() => {
		const notifications = this.notifications()
		const multiSelectedNotificationIds = this.multiSelectedNotificationIds()
		return notifications.length === multiSelectedNotificationIds.length
	})

	vm = computed(() => {
		const user = this._authStore.select.user()
		const notifications = this.notifications()
		const openedNotifications = this.openedNotifications()
		const selectedNotificationId = this.selectedNotificationId()
		const multiSelectedNotificationIds = this.multiSelectedNotificationIds()
		const allNotificationsSelected = this.allNotificationsSelected()
		return {
			user,
			notifications,
			openedNotifications,
			selectedNotificationId,
			multiSelectedNotificationIds,
			allNotificationsSelected,
		}
	})

	protected readonly getNotificationTypeToText = getNotificationTypeToText
	protected readonly notification = notification
	protected readonly getContentMessageHtmlBasedOnType = getContentMessageHtmlBasedOnType
	protected readonly NOTIFICATION_TYPE = NOTIFICATION_TYPE
	protected readonly getContentMessageBasedOnType = getContentMessageBasedOnType
	protected readonly getContentMessageBasedOnTypeWithoutDisplayName =
		getContentMessageBasedOnTypeWithoutDisplayName

	selectAllNotifications() {
		if (!this.allNotificationsSelected()) {
			this.multiSelectedNotificationIds.set(
				this.notifications().map((notification) => notification.id),
			)
			return
		}
		this.multiSelectedNotificationIds.set([])
		console.log('selectAllNotifications', this.multiSelectedNotificationIds())
	}

	notificationById(id: string) {
		return this.notifications().find((notification) => notification.id === id)
	}

	isFirstInList(notification: NotificationModel) {
		return this.notifications()[0].id === notification.id
	}

	selectProject(notification: NotificationModel) {
		if (this.selectedNotificationId() === notification.id) return
		this.selectedNotificationId.set(notification.id)
	}

	toggleNotificationView(notification: NotificationModel) {
		const id = notification.id
		this.openedNotifications.set(
			new Map(this.openedNotifications()).set(id, !this.openedNotifications().get(id)),
		)
	}

	acceptNotification(notification: NotificationModel) {
		switch (notification.notificationType) {
			case NOTIFICATION_TYPE.PROJECT_INVITE_RECEIVED:
				{
					console.log('acceptNotification', notification)
				}
				break
			case NOTIFICATION_TYPE.FRIEND_REQUEST_RECEIVED:
				{
					console.log('acceptNotification', notification)
					this._usersStore.dispatch.acceptFriendRequest(notification.senderAppUserId)
				}
				break
			default:
				throw new Error('Unknown notification type')
		}
	}

	declineNotification(notification: NotificationModel) {
		switch (notification.notificationType) {
			case NOTIFICATION_TYPE.PROJECT_INVITE_RECEIVED:
				{
					console.log('declineNotification', notification)
				}
				break
			case NOTIFICATION_TYPE.FRIEND_REQUEST_RECEIVED:
				{
					console.log('declineNotification', notification)
					this._usersStore.dispatch.rejectFriendRequest(notification.senderAppUserId)
				}
				break
			default:
				throw new Error('Unknown notification type')
		}
	}

	dismissNotification(notification: NotificationModel) {
		console.log('dismissNotification', notification)
	}

	replyToMessage(notification: NotificationModel) {
		console.log('replyToMessage', notification)
	}

	isLastInList(notification: NotificationModel) {
		return this.notifications()[this.notifications().length - 1].id === notification.id
	}

	toggleNotificationMultiSelect(notification: NotificationModel) {
		if (this.multiSelectedNotificationIds().includes(notification.id)) {
			this.multiSelectedNotificationIds.set(
				this.multiSelectedNotificationIds().filter((id) => id !== notification.id),
			)
			return
		}
		this.multiSelectedNotificationIds.set([...this.multiSelectedNotificationIds(), notification.id])
	}

	deleteSelectedNotifications() {
		const multiSelectedNotificationIds = this.multiSelectedNotificationIds()
		console.log('deleteSelectedNotifications', multiSelectedNotificationIds)
		// TODO: implement
		// this._notificationsStore.dispatch.deleteNotifications(multiSelectedNotificationIds)
		this.multiSelectedNotificationIds.set([])
	}
}
