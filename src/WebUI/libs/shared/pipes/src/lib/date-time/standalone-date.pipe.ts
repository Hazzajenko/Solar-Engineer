import { Pipe, PipeTransform } from '@angular/core'
import { formatDate } from '@angular/common'

// export type DateTimeFormat = 'short' | 'medium' | 'long' | 'full'

@Pipe({
	name: 'standaloneDate',
	standalone: true,
})
export class StandaloneDatePipe implements PipeTransform {
	transform(dateTime: string | undefined | null, format: 'short' | 'medium' = 'short') {
		if (!dateTime) return
		return formatDate(dateTime, format, 'en-US')
	}
}
