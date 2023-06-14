import {
	ChangeDetectionStrategy,
	Component,
	computed,
	ElementRef,
	inject,
	OnDestroy,
	OnInit,
	Renderer2,
	signal,
} from '@angular/core'
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
import { TimeDifferenceFromNowPipe, TruncatePipe } from '@shared/pipes'
import { LetDirective } from '@ngrx/component'
import {
	getContentMessageBasedOnType,
	getContentMessageBasedOnTypeWithoutDisplayName,
	getContentMessageHtmlBasedOnType,
	getNotificationTypeToText,
	isProjectNotification,
} from '@auth/utils'
import { CenterThisElementDirective, DefaultHoverEffectsDirective } from '@shared/directives'
import { notification } from '@tauri-apps/api'
import { assertNotNull, getTimeDifferenceFromNow, ToSafeHtmlPipe } from '@shared/utils'
import { heightInOutWithConfig } from '@shared/animations'
import { MatTooltipModule } from '@angular/material/tooltip'
import { injectProjectsStore } from '@entities/data-access'

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
		TimeDifferenceFromNowPipe,
		MatTooltipModule,
	],
	templateUrl: './side-ui-notifications-view.component.html',
	styles: [],
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [heightInOutWithConfig(0.1)],
})
export class SideUiNotificationsViewComponent implements OnInit, OnDestroy {
	private _authStore = injectAuthStore()
	private _usersStore = injectUsersStore()
	private _notificationsStore = injectNotificationsStore()
	private _projectsStore = injectProjectsStore()
	private _elementRef = inject(ElementRef)
	private _renderer = inject(Renderer2)
	private _disposeClickListener!: ReturnType<typeof Renderer2.prototype.listen>

	user = this._authStore.select.user
	notifications = this._notificationsStore.select.notCompletedNotifications
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
	protected readonly getTimeDifferenceFromNow = getTimeDifferenceFromNow

	ngOnInit() {
		this._disposeClickListener = this._renderer.listen(
			this._elementRef.nativeElement,
			'click',
			(event) => {
				event.preventDefault()
				event.stopPropagation()

				const target = event.target as HTMLElement
				const contains = Array.from(target.children).find((child) => {
					const childAttributes = Array.from(child.attributes)
					const dataType = childAttributes.find((attr) => attr.value === 'notification-preview')
					return !!dataType
				})
				if (contains) {
					const notificationId = contains.id
					if (notificationId) {
						this.toggleNotificationView(notificationId)
					}
				}
			},
		)
	}

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

	toggleNotificationView(notification: NotificationModel | string) {
		const id = typeof notification === 'string' ? notification : notification.id
		this.openedNotifications.set(
			new Map(this.openedNotifications()).set(id, !this.openedNotifications().get(id)),
		)
		const getNotification = this.notificationById(id)
		assertNotNull(getNotification, 'Notification not found')
		if (!getNotification.seenByAppUser) {
			this._notificationsStore.dispatch.markManyNotificationsAsRead([id])
		}
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
						projectId: notification.projectId,
						notificationId: notification.id,
					})
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
		this._notificationsStore.dispatch.markNotificationsAsCompleted([notification.id])
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
		this._notificationsStore.dispatch.markNotificationsAsCompleted(multiSelectedNotificationIds)
		this.multiSelectedNotificationIds.set([])
	}

	markSelectedNotificationsAsRead() {
		const multiSelectedNotificationIds = this.multiSelectedNotificationIds()
		console.log('markSelectedNotificationsAsRead', multiSelectedNotificationIds)
		this._notificationsStore.dispatch.markManyNotificationsAsRead(multiSelectedNotificationIds)
	}

	ngOnDestroy() {
		this._disposeClickListener()
	}
}
