import {
	ChangeDetectionStrategy,
	Component,
	computed,
	effect,
	ElementRef,
	inject,
	QueryList,
	Renderer2,
	ViewChildren,
} from '@angular/core'
import { injectUsersStore } from '@auth/data-access'
import { injectProjectsStore } from '@entities/data-access'
import {
	DEFAULT_NOTIFICATION_DURATION,
	injectNotificationsStore,
} from '@overlays/notifications/data-access'
import { notificationAnimation } from '@shared/animations'
import {
	LocalNotification,
	NOTIFICATION_COMPONENT_TYPE,
	OverlayNotification,
	SignalrNotification,
} from '@overlays/notifications/shared'
import { DynamicNotificationModel, NOTIFICATION_TYPE } from '@auth/shared'
import { notification } from '@tauri-apps/api'
import { isProjectNotification } from '@auth/utils'
import {
	NgForOf,
	NgIf,
	NgOptimizedImage,
	NgSwitch,
	NgSwitchCase,
	NgTemplateOutlet,
} from '@angular/common'
import { IsSignalrNotificationPipe } from './is-signalr-notification.pipe'
import {
	GetContentMessageHtmlBasedOnTypePipe,
	getNotificationContentMessageBasedOnTypePipe,
} from '@overlays/notifications/utils'
import { IsLocalNotificationPipe } from './is-local-notification.pipe'

@Component({
	selector: 'overlay-notification',
	standalone: true,
	imports: [
		NgForOf,
		NgIf,
		NgOptimizedImage,
		IsSignalrNotificationPipe,
		GetContentMessageHtmlBasedOnTypePipe,
		IsLocalNotificationPipe,
		NgTemplateOutlet,
		NgSwitch,
		NgSwitchCase,
		getNotificationContentMessageBasedOnTypePipe,
	],
	templateUrl: './overlay-notification.component.html',
	styles: [],
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [notificationAnimation],
})
export class OverlayNotificationComponent {
	private _usersStore = injectUsersStore()
	private _renderer = inject(Renderer2)
	private _projectsStore = injectProjectsStore()
	private _notificationsStore = injectNotificationsStore()
	private _signalrNotifications =
		this._notificationsStore.select.notificationsThatUserHasNotReceived
	private _localNotifications = this._notificationsStore.select.dynamicNotifications
	@ViewChildren('progressBar') progressBarEls!: QueryList<ElementRef<HTMLDivElement>>
	frames = 100
	duration = DEFAULT_NOTIFICATION_DURATION

	notifications = computed(() => {
		const signalrNotifications = this._signalrNotifications().map(
			(n) =>
				({
					...n,
					componentType: 'Signalr',
				} as SignalrNotification),
		)
		const localNotifications = this._localNotifications().map(
			(n) =>
				({
					...n,
					componentType: 'Local',
				} as LocalNotification),
		)
		return [...signalrNotifications, ...localNotifications] as OverlayNotification[]
	})
	protected readonly notification = notification
	protected readonly NOTIFICATION_TYPE = NOTIFICATION_TYPE
	protected readonly NOTIFICATION_COMPONENT_TYPE = NOTIFICATION_COMPONENT_TYPE

	constructor() {
		effect(() => {
			this.notifications().forEach((notification) => {
				if (!notification) {
					return
				}
				setTimeout(() => {
					const progressBarEl = this.progressBarEls.find(
						(p) => p.nativeElement.id === `progressBar-${notification.id}`,
					)
					if (!progressBarEl) {
						return
					}
					this.triggerNotificationTimer(notification, progressBarEl.nativeElement as HTMLDivElement)
				}, 100)
			})
		})
	}

	triggerNotificationTimer(notification: OverlayNotification, progressBar: HTMLDivElement) {
		setTimeout(() => {
			switch (notification.componentType) {
				case 'Local':
					this.deleteDynamicNotification(notification.id)
					break
				case 'Signalr':
					this.closeSignalrNotification(notification)
					break
			}
		}, this.duration)
		for (let i = 1; i < this.frames; i++) {
			setTimeout(() => {
				this._renderer.setStyle(progressBar, 'width', `${(i * 100) / this.frames}%`)
			}, (i * this.duration) / this.frames)
		}
	}

	closeSignalrNotification(notification: SignalrNotification) {
		this._notificationsStore.dispatch.updateNotification({
			id: notification.id,
			changes: {
				seenByAppUser: true,
			},
		})
	}

	dispatchNotificationAction(dynamicNotification: DynamicNotificationModel) {
		if (!dynamicNotification.actionButton) throw new Error('No action button')
		dynamicNotification.actionButton.onClick()
		this.deleteDynamicNotification(dynamicNotification.id)
	}

	acceptNotification(notification: SignalrNotification) {
		switch (notification.notificationType) {
			case NOTIFICATION_TYPE.PROJECT_INVITE_RECEIVED:
				{
					console.log('acceptNotification', notification)
					if (!isProjectNotification(notification)) {
						throw new Error('Notification is not a project notification')
					}
					this._projectsStore.dispatch.acceptProjectInvite({
						notificationId: notification.id,
						projectId: notification.projectId,
					})
					this.dismissNotification(notification)
				}
				break
			case NOTIFICATION_TYPE.FRIEND_REQUEST_RECEIVED:
				{
					console.log('acceptNotification', notification)
					this._usersStore.dispatch.acceptFriendRequest(notification.senderAppUserId)
					this.dismissNotification(notification)
				}
				break
			default:
				throw new Error('Unknown notification type')
		}
	}

	declineNotification(notification: SignalrNotification) {
		switch (notification.notificationType) {
			case NOTIFICATION_TYPE.PROJECT_INVITE_RECEIVED:
				{
					console.log('declineNotification', notification)
					if (!isProjectNotification(notification)) {
						throw new Error('Notification is not a project notification')
					}
					this._projectsStore.dispatch.rejectProjectInvite({
						notificationId: notification.id,
						projectId: notification.projectId,
					})
					this.dismissNotification(notification)
				}
				break
			case NOTIFICATION_TYPE.FRIEND_REQUEST_RECEIVED:
				{
					console.log('declineNotification', notification)
					this._usersStore.dispatch.rejectFriendRequest(notification.senderAppUserId)
					this.dismissNotification(notification)
				}
				break
			default:
				throw new Error('Unknown notification type')
		}
	}

	dismissNotification(notification: OverlayNotification) {
		console.log('dismissNotification', notification)
		if (notification.componentType === 'Signalr') {
			this._notificationsStore.dispatch.markNotificationsAsCompleted([notification.id])
			return
		}
		this.deleteDynamicNotification(notification.id)
	}

	replyToMessage(notification: SignalrNotification) {
		console.log('replyToMessage', notification)
	}

	private deleteDynamicNotification(dynamicNotificationId: DynamicNotificationModel['id']) {
		this._notificationsStore.dispatch.deleteDynamicNotification(dynamicNotificationId)
	}
}
