import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core'
import { NotificationModel } from '@auth/shared'
import {
	getContentMessageBasedOnTypeWithoutDisplayName,
	GetContentMessageBasedOnTypeWithoutDisplayNamePipe,
} from '@auth/utils'
import { CenterThisElementDirective } from '@shared/directives'
import { NgClass, NgIf, NgOptimizedImage } from '@angular/common'
import { TimeDifferenceFromNowPipe, TruncatePipe } from '@shared/pipes'
import { ButtonAnimatedDownUpArrowComponent } from '@shared/ui'

@Component({
	selector: 'app-notifications-view-notification-preview',
	standalone: true,
	imports: [
		CenterThisElementDirective,
		NgIf,
		NgClass,
		NgOptimizedImage,
		TruncatePipe,
		GetContentMessageBasedOnTypeWithoutDisplayNamePipe,
		TimeDifferenceFromNowPipe,
		ButtonAnimatedDownUpArrowComponent,
	],
	templateUrl: './notifications-view-notification-preview.component.html',
	styles: [],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationsViewNotificationPreviewComponent {
	@Input({ required: true }) notification!: NotificationModel
	@Input({ required: true }) isOpen = false
	@Input({ required: true }) isChecked = false

	@Output() readonly notificationViewToggle = new EventEmitter<NotificationModel['id']>()
	@Output() readonly notificationMultiSelect = new EventEmitter<NotificationModel['id']>()
	protected readonly getContentMessageBasedOnTypeWithoutDisplayName =
		getContentMessageBasedOnTypeWithoutDisplayName

	toggleNotificationMultiSelect() {
		this.notificationMultiSelect.emit(this.notification.id)
	}

	toggleNotificationView() {
		this.notificationViewToggle.emit(this.notification.id)
	}
}
