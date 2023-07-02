import {
	ChangeDetectionStrategy,
	Component,
	effect,
	ElementRef,
	inject,
	QueryList,
	Renderer2,
	ViewChildren,
} from '@angular/core'
import {
	DEFAULT_NOTIFICATION_DURATION,
	injectNotificationsStore,
} from '@overlays/notifications/data-access'
import { DynamicNotificationModel } from '@auth/shared'
import { NgForOf, NgIf, NgOptimizedImage } from '@angular/common'
import { notificationAnimation } from '@shared/animations'

@Component({
	selector: 'overlay-dynamic-notification',
	standalone: true,
	imports: [NgForOf, NgIf, NgOptimizedImage],
	templateUrl: './overlay-dynamic-notification.component.html',
	styles: [],
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [notificationAnimation],
})
export class OverlayDynamicNotificationComponent {
	private _notificationsStore = injectNotificationsStore()
	private _renderer = inject(Renderer2)

	dynamicNotifications = this._notificationsStore.select.dynamicNotifications
	@ViewChildren('progressBar') progressBarEls!: QueryList<ElementRef<HTMLDivElement>>
	private _notificationEffect = effect(() => {
		this.dynamicNotifications().forEach((notification) => {
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

	dismissNotification(dynamicNotification: DynamicNotificationModel) {
		dynamicNotification.dismissButton.onClick?.()
		this._notificationsStore.dispatch.deleteDynamicNotification(dynamicNotification.id)
	}

	dispatchNotificationAction(dynamicNotification: DynamicNotificationModel) {
		if (!dynamicNotification.actionButton) throw new Error('No action button')
		dynamicNotification.actionButton.onClick()
		this.deleteDynamicNotification(dynamicNotification.id)
	}

	triggerLocalNotificationTimer(
		notification: DynamicNotificationModel,
		progressBar: HTMLDivElement,
	) {
		const duration = DEFAULT_NOTIFICATION_DURATION
		setTimeout(() => {
			this.deleteDynamicNotification(notification.id)
		}, duration)
		const frames = 100
		for (let i = 1; i < frames; i++) {
			setTimeout(() => {
				this._renderer.setStyle(progressBar, 'width', `${(i * 100) / frames}%`)
			}, (i * duration) / frames)
		}
	}

	private deleteDynamicNotification(dynamicNotificationId: DynamicNotificationModel['id']) {
		this._notificationsStore.dispatch.deleteDynamicNotification(dynamicNotificationId)
	}
}
