import { Pipe, PipeTransform } from '@angular/core'
import { OverlayNotification, SignalrNotification } from '@overlays/notifications/shared'

@Pipe({
	name: 'isSignalrNotification',
	standalone: true,
})
export class IsSignalrNotificationPipe implements PipeTransform {
	transform(value: OverlayNotification): SignalrNotification {
		if (value.componentType === 'Signalr') {
			return value
		}
		throw new Error('Value is not a SignalrNotification')
	}
}
