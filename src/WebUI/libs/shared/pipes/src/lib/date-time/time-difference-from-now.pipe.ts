import { Pipe, PipeTransform } from '@angular/core'
import { getTimeDifferenceFromNow } from '@shared/utils'

@Pipe({
	name: 'timeDifferenceFromNow',
	standalone: true,
})
export class TimeDifferenceFromNowPipe implements PipeTransform {
	transform(dateTime: string | undefined | null, format: 'short' | 'medium' = 'short') {
		if (!dateTime) return
		return getTimeDifferenceFromNow(dateTime, format)
	}
}
