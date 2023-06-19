import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core'
import { NOTIFICATION_TYPE, NotificationModel } from '@auth/shared'
import { GetContentMessageHtmlBasedOnTypePipe } from '@auth/utils'
import { NgIf } from '@angular/common'
import { ToSafeHtmlPipe } from '@shared/utils'

@Component({
	selector: 'app-notifications-view-notification-item',
	standalone: true,
	imports: [NgIf, ToSafeHtmlPipe, GetContentMessageHtmlBasedOnTypePipe],
	templateUrl: './notifications-view-notification-item.component.html',
	styles: [],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationsViewNotificationItemComponent {
	@Input({ required: true }) notification!: NotificationModel
	@Output() readonly acceptedNotification = new EventEmitter<NotificationModel['id']>()
	@Output() readonly declinedNotification = new EventEmitter<NotificationModel['id']>()
	@Output() readonly dismissedNotification = new EventEmitter<NotificationModel['id']>()
	@Output() readonly repliedToMessage = new EventEmitter<NotificationModel['id']>()
	protected readonly NOTIFICATION_TYPE = NOTIFICATION_TYPE

	acceptNotification() {
		this.acceptedNotification.emit(this.notification.id)
	}

	declineNotification() {
		this.declinedNotification.emit(this.notification.id)
	}

	dismissNotification() {
		this.dismissedNotification.emit(this.notification.id)
	}

	replyToMessage() {
		this.repliedToMessage.emit(this.notification.id)
	}
}
