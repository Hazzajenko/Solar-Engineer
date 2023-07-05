import {
	AfterViewInit,
	ChangeDetectionStrategy,
	Component,
	computed,
	effect,
	ElementRef,
	inject,
	QueryList,
	Renderer2,
	signal,
	ViewChildren,
} from '@angular/core'
import { DatePipe, NgForOf, NgIf, NgOptimizedImage, NgTemplateOutlet } from '@angular/common'
import { notificationAnimation } from '@shared/animations'
import { LetDirective } from '@ngrx/component'
import {
	DEFAULT_NOTIFICATION_DURATION,
	injectNotificationsStore,
} from '@overlays/notifications/data-access'
import {
	LOCAL_NOTIFICATION_TYPE,
	LocalNotification__UserStatusChanged,
	LocalNotificationModel,
	NOTIFICATION_MODEL_SCHEMA,
	NOTIFICATION_TYPE,
	NotificationModel,
} from '@auth/shared'
import {
	getLocalNotificationContentMessageBasedOnType,
	getNotificationContentMessageBasedOnType,
	isProjectNotification,
} from '@auth/utils'
import { notification } from '@tauri-apps/api'
import { injectUsersStore } from '@auth/data-access'
import { injectProjectsStore } from '@entities/data-access'

@Component({
	selector: 'overlay-notification-modal',
	standalone: true,
	imports: [NgForOf, NgIf, LetDirective, NgOptimizedImage, DatePipe, NgTemplateOutlet],
	templateUrl: './overlay-notification-modal.component.html',
	styles: [],
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [notificationAnimation],
})
export class OverlayNotificationModalComponent implements AfterViewInit {
	private _usersStore = injectUsersStore()
	private _renderer = inject(Renderer2)
	private _projectsStore = injectProjectsStore()
	private _notificationsStore = injectNotificationsStore()
	private _notificationStartTimeMap = signal(new Map<string, number>())
	notifications = this._notificationsStore.select.notificationsThatUserHasNotReceived
	localNotifications = this._notificationsStore.select.localNotifications
	localUserNotifications = computed(() => {
		const localNotifications = this._notificationsStore.select.localNotifications()
		return localNotifications.filter(
			(n) =>
				n.notificationType === LOCAL_NOTIFICATION_TYPE.USER_IS_ONLINE ||
				n.notificationType === LOCAL_NOTIFICATION_TYPE.USER_IS_OFFLINE,
		) as LocalNotification__UserStatusChanged[]
	})
	localProjectNotifications = computed(() => {
		const localNotifications = this._notificationsStore.select.localNotifications()
		return localNotifications.filter(
			(n) => n.notificationType === LOCAL_NOTIFICATION_TYPE.LOADED_LOCAL_SAVE,
		)
	})
	@ViewChildren('notificationEl') notificationEls!: QueryList<HTMLDivElement>
	@ViewChildren('progressBar') progressBarEls!: QueryList<ElementRef<HTMLDivElement>>
	protected readonly getContentMessageBasedOnType = getNotificationContentMessageBasedOnType
	protected readonly NOTIFICATION_TYPE = NOTIFICATION_TYPE
	protected readonly notification = notification
	protected readonly getLocalNotificationContentMessageBasedOnType =
		getLocalNotificationContentMessageBasedOnType

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
		effect(() => {
			this.localNotifications().forEach((notification) => {
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
					this.triggerLocalNotificationTimer(
						notification,
						progressBarEl.nativeElement as HTMLDivElement,
					)
				}, 100)
			})
		})
	}

	isNotification(notification: NotificationModel) {
		return NOTIFICATION_MODEL_SCHEMA.parse(notification) as NotificationModel
	}

	ngAfterViewInit() {
		if (this.notificationEls) {
			this.notificationEls.forEach((notificationDiv) => {
				if (!notificationDiv.id) {
					return
				}
				const notification = this.notifications().find((n) => n.id === notificationDiv.id)
				if (!notification) {
					return
				}
				const progressBarEl = notificationDiv.querySelector('.progress-bar')
				if (!progressBarEl) {
					return
				}
				this.triggerNotificationTimer(notification, progressBarEl as HTMLDivElement)
			})
		}
	}

	triggerLocalNotificationTimer(notification: LocalNotificationModel, progressBar: HTMLDivElement) {
		// this.notificationStartTimeMap.set(notification.id, Date.now())
		const duration = DEFAULT_NOTIFICATION_DURATION
		setTimeout(() => {
			this._notificationsStore.dispatch.deleteLocalNotification(notification.id)
		}, duration)
		const frames = 100
		for (let i = 1; i < frames; i++) {
			setTimeout(() => {
				this._renderer.setStyle(progressBar, 'width', `${(i * 100) / frames}%`)
			}, (i * duration) / frames)
		}
	}

	triggerNotificationTimer(notification: NotificationModel, progressBar: HTMLDivElement) {
		const duration = DEFAULT_NOTIFICATION_DURATION
		setTimeout(() => {
			this._notificationsStore.dispatch.updateNotification({
				id: notification.id,
				changes: {
					receivedByAppUser: true,
				},
			})
		}, duration)
		const frames = 100
		for (let i = 1; i < frames; i++) {
			setTimeout(() => {
				this._renderer.setStyle(progressBar, 'width', `${(i * 100) / frames}%`)
			}, (i * duration) / frames)
		}
	}

	closeNotification(notification: NotificationModel) {
		this._notificationsStore.dispatch.updateNotification({
			id: notification.id,
			changes: {
				seenByAppUser: true,
			},
		})
	}

	acceptNotification(notification: NotificationModel) {
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

	declineNotification(notification: NotificationModel) {
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

	dismissNotification(notification: NotificationModel) {
		console.log('dismissNotification', notification)
		this._notificationsStore.dispatch.markNotificationsAsCompleted([notification.id])
	}

	replyToMessage(notification: NotificationModel) {
		console.log('replyToMessage', notification)
	}

	dismissLocalNotification(localNotification: LocalNotificationModel) {
		this._notificationsStore.dispatch.deleteLocalNotification(localNotification.id)
	}
}
