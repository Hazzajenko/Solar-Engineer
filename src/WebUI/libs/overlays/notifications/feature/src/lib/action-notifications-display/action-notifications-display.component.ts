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
import { MatSnackBar } from '@angular/material/snack-bar'

@Component({
	selector: 'app-action-notifications-display',
	standalone: true,
	imports: [NgForOf, ActionNotificationComponent, NgIf, LetDirective],
	templateUrl: './action-notifications-display.component.html',
	styles: [],
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [notificationAnimation],
})
export class ActionNotificationsDisplayComponent implements AfterViewInit {
	private _renderer = inject(Renderer2)
	private _notificationsStore = inject(NotificationsStoreService)
	private _notifications = toSignal(this._notificationsStore.allNotifications$, {
		initialValue: this._notificationsStore.allNotifications,
	})
	private _snackBar = inject(MatSnackBar)
	private _notificationStartTimeMap = signal(new Map<string, number>())
	private _notificationTimeLeftMap = signal(new Map<string, number>())
	@ViewChildren('notificationEl') notificationEls!: QueryList<HTMLDivElement>
	@ViewChildren('progressBar') progressBarEls!: QueryList<ElementRef<HTMLDivElement>>

	constructor() {
		effect(() => {
			this._notifications().forEach((notification) => {
				if (!notification) {
					return
				}
				setTimeout(() => {
					const progressBarEl = this.progressBarEls.find(
						(p) => p.nativeElement.id === `progressBar-${notification.id}`,
					)
					// console.log('progressBarEl', progressBarEl)
					if (!progressBarEl) {
						return
					}
					this.triggerNotificationTimer(notification, progressBarEl.nativeElement as HTMLDivElement)
					this._snackBar.open(notification.title, 'Ok', {
						horizontalPosition: 'start',
						verticalPosition: 'bottom',
						duration: DEFAULT_NOTIFICATION_DURATION,
						direction: 'ltr',
						politeness: 'assertive',
						announcementMessage: notification.title,
					})
				}, 100)
			})
		})
		// const wat : AppIconNameSubset<'add'> =
		// type emojiIcons = AppIconNameSubset<[typeof appIconAdd]>
		// appIconAdd.data
		// const wat : emojiIcons[0] = '';
	}

	get notifications() {
		return this._notifications()
	}

	get notificationStartTimeMap() {
		return this._notificationStartTimeMap()
	}

	set notificationStartTimeMap(value) {
		this._notificationStartTimeMap.set(value)
	}

	get notificationTimeLeftMap() {
		return this._notificationTimeLeftMap()
	}

	set notificationTimeLeftMap(value) {
		this._notificationTimeLeftMap.set(value)
	}

	ngAfterViewInit() {
		if (this.notificationEls) {
			// console.log('notificationEls', this.notificationEls)
			this.notificationEls.forEach((notificationDiv) => {
				if (!notificationDiv.id) {
					return
				}
				const notification = this.notifications.find((n) => n.id === notificationDiv.id)
				if (!notification) {
					return
				}
				const progressBarEl = notificationDiv.querySelector('.progress-bar')
				if (!progressBarEl) {
					return
				}
				this.triggerNotificationTimer(notification, progressBarEl as HTMLDivElement)
				// this.openedAccordions.mutate((value) => value.set(notification.nativeElement.id, true))
			})
		}
	}

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
