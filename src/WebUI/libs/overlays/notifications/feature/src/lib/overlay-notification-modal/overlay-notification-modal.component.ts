import {
	AfterViewInit,
	ChangeDetectionStrategy,
	Component,
	effect,
	ElementRef,
	inject,
	QueryList,
	Renderer2,
	signal,
	ViewChildren,
} from '@angular/core'
import { DatePipe, NgForOf, NgIf, NgOptimizedImage } from '@angular/common'
import { ActionNotificationComponent } from '../action-notification'
import { notificationAnimation } from '@shared/animations'
import { LetDirective } from '@ngrx/component'
import {
	DEFAULT_NOTIFICATION_DURATION,
	injectNotificationsStore,
} from '@overlays/notifications/data-access'
import { NotificationModel } from '@auth/shared'
import { getContentMessageBasedOnType } from '@auth/utils'

@Component({
	selector: 'overlay-notification-modal',
	standalone: true,
	imports: [NgForOf, ActionNotificationComponent, NgIf, LetDirective, NgOptimizedImage, DatePipe],
	templateUrl: './overlay-notification-modal.component.html',
	styles: [],
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [notificationAnimation],
})
export class OverlayNotificationModalComponent implements AfterViewInit {
	private _renderer = inject(Renderer2)
	private _notificationsStore = injectNotificationsStore()
	private _notificationStartTimeMap = signal(new Map<string, number>())
	/*	notifications = computed(() =>
	 this._notificationsStore.select
	 .allNotifications()
	 .filter((notification) => !notification.receivedByAppUser),
	 )*/
	notifications = this._notificationsStore.select.notificationsThatUserHasNotReceived
	@ViewChildren('notificationEl') notificationEls!: QueryList<HTMLDivElement>
	@ViewChildren('progressBar') progressBarEls!: QueryList<ElementRef<HTMLDivElement>>
	protected readonly getContentMessageBasedOnType = getContentMessageBasedOnType

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

	get notificationStartTimeMap() {
		return this._notificationStartTimeMap()
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

	/*	getContentMessageBasedOnType(notification: NotificationModel) {
	 switch (notification.notificationType) {
	 case NOTIFICATION_TYPE.MESSAGE_RECEIVED:
	 return `${notification.senderAppUserUserName} sent you a message`
	 case NOTIFICATION_TYPE.FRIEND_REQUEST_RECEIVED:
	 return `${notification.senderAppUserUserName} sent you a friend request`
	 case NOTIFICATION_TYPE.FRIEND_REQUEST_ACCEPTED:
	 return `${notification.senderAppUserUserName} accepted your friend request`
	 case NOTIFICATION_TYPE.PROJECT_INVITE_RECEIVED:
	 return `${notification.senderAppUserUserName} invited you to a project`
	 case NOTIFICATION_TYPE.PROJECT_INVITE_ACCEPTED:
	 return `${notification.senderAppUserUserName} accepted your project invite`
	 default:
	 throw new Error('Unknown notification type')
	 }
	 }*/

	triggerNotificationTimer(notification: NotificationModel, progressBar: HTMLDivElement) {
		this.notificationStartTimeMap.set(notification.id, Date.now())
		const duration = DEFAULT_NOTIFICATION_DURATION
		setTimeout(() => {
			this._notificationsStore.dispatch.updateNotification({
				id: notification.id,
				changes: {
					seenByAppUser: true,
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
}
