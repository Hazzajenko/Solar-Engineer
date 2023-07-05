import { Pipe, PipeTransform } from '@angular/core'
import { LocalNotification, OverlayNotification } from '@overlays/notifications/shared'

@Pipe({
	name: 'isLocalNotification',
	standalone: true,
})
export class IsLocalNotificationPipe implements PipeTransform {
	transform(value: OverlayNotification): LocalNotification {
		if (value.componentType === 'Local') {
			return value
		}
		throw new Error('Value is not a LocalNotification')
	}
}
