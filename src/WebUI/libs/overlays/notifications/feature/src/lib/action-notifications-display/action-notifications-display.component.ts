import { ChangeDetectionStrategy, Component, inject, Renderer2, signal } from '@angular/core'
import { NgForOf, NgIf } from '@angular/common'
import { ActionNotificationComponent } from '../action-notification'
import { toSignal } from '@angular/core/rxjs-interop'
import { notificationAnimation } from '@shared/animations'
import { LetDirective } from '@ngrx/component'
import {
	ActionNotificationModel,
	DEFAULT_NOTIFICATION_DURATION,
	NotificationsStoreService,
} from '@overlays/notifications/data-access'

@Component({
	selector: 'app-action-notifications-display',
	standalone: true,
	imports: [NgForOf, ActionNotificationComponent, NgIf, LetDirective],
	templateUrl: './action-notifications-display.component.html',
	styles: [],
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [notificationAnimation],
})
export class ActionNotificationsDisplayComponent {
	private _renderer = inject(Renderer2)
	private _notificationsStore = inject(NotificationsStoreService)
	private _notifications = toSignal(this._notificationsStore.allNotifications$, {
		initialValue: this._notificationsStore.allNotifications,
	})

	get notifications() {
		return this._notifications()
	}

	private _notificationStartTimeMap = signal(new Map<string, number>())

	get notificationStartTimeMap() {
		return this._notificationStartTimeMap()
	}

	set notificationStartTimeMap(value) {
		this._notificationStartTimeMap.set(value)
	}

	private _notificationTimeLeftMap = signal(new Map<string, number>())

	get notificationTimeLeftMap() {
		return this._notificationTimeLeftMap()
	}

	set notificationTimeLeftMap(value) {
		this._notificationTimeLeftMap.set(value)
	}

	// /notificationTimeLeftMap = new Map<string, number>()

	/*	notificationsToAdd: ActionNotificationModel[] = [
	 {
	 id: '1',
	 title: 'Notification 1',
	 isOpen: true,
	 buttons: [
	 {
	 text: 'Ok',
	 action: () => {
	 console.log('Ok')
	 },
	 },
	 {
	 text: 'Cancel',
	 action: () => {
	 console.log('Cancel')
	 },
	 },
	 ],
	 },
	 {
	 id: '2',
	 title: 'Notification 2',
	 isOpen: true,
	 buttons: [
	 {
	 text: 'Ok',
	 action: () => {
	 console.log('Ok')
	 },
	 },
	 {
	 text: 'Cancel',
	 action: () => {
	 console.log('Cancel')
	 },
	 },
	 ],
	 },
	 ]*/

	triggerNotificationTimer(notification: ActionNotificationModel, progressBar: HTMLDivElement) {
		/*		this._renderer.setStyle(notificationEl, 'z-index', '1000')
		 this._renderer.listen(notificationEl, 'click', () => {
		 console.log('click')
		 })*/
		this.notificationStartTimeMap.set(notification.id, Date.now())
		const duration = notification.duration ?? DEFAULT_NOTIFICATION_DURATION
		setTimeout(() => {
			this._notificationsStore.dispatch.updateNotification({
				id: notification.id,
				changes: {
					isOpen: false,
				},
			})
		}, duration)
		const frames = 100
		// const frames = 50
		for (let i = 1; i < frames; i++) {
			setTimeout(() => {
				// console.log(notification.id, duration - (i * duration) / 10)
				this._renderer.setStyle(progressBar, 'width', `${(i * 100) / frames}%`)
			}, (i * duration) / frames)
		}
	}

	closeNotification(notification: ActionNotificationModel) {
		this._notificationsStore.dispatch.updateNotification({
			id: notification.id,
			changes: {
				isOpen: false,
			},
		})
	}
}
