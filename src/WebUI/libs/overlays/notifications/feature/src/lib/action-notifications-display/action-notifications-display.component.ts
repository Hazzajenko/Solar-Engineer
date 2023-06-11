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
import { NgForOf, NgIf, NgOptimizedImage } from '@angular/common'
import { ActionNotificationComponent } from '../action-notification'
import { notificationAnimation } from '@shared/animations'
import { LetDirective } from '@ngrx/component'
import {
	DEFAULT_NOTIFICATION_DURATION,
	injectNotificationsStore,
} from '@overlays/notifications/data-access'
import { NotificationModel } from '@auth/shared'

@Component({
	selector: 'app-action-notifications-display',
	standalone: true,
	imports: [NgForOf, ActionNotificationComponent, NgIf, LetDirective, NgOptimizedImage],
	templateUrl: './action-notifications-display.component.html',
	styles: [],
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [notificationAnimation],
})
export class ActionNotificationsDisplayComponent implements AfterViewInit {
	private _renderer = inject(Renderer2)
	private _notificationsStore = injectNotificationsStore()
	private _notificationStartTimeMap = signal(new Map<string, number>())
	notifications = this._notificationsStore.select.allNotifications
	@ViewChildren('notificationEl') notificationEls!: QueryList<HTMLDivElement>
	@ViewChildren('progressBar') progressBarEls!: QueryList<ElementRef<HTMLDivElement>>

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
