import { ChangeDetectionStrategy, Component } from '@angular/core'
import { notificationAnimation } from '@shared/animations'

@Component({
	selector: 'app-action-notification',
	standalone: true,
	imports: [],
	templateUrl: './action-notification.component.html',
	styles: [],
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [notificationAnimation],
})
export class ActionNotificationComponent {}
