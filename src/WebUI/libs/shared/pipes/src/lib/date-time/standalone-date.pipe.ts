import { Pipe, PipeTransform } from '@angular/core'
import { formatDate } from '@angular/common'

// eslint-disable-next-line @typescript-eslint/ban-types
export type DateTimeFormat = 'short' | 'medium' | (string & {})

@Pipe({
	name: 'standaloneDate',
	standalone: true,
})
export class StandaloneDatePipe implements PipeTransform {
	transform(dateTime: string | undefined | null, format: DateTimeFormat = 'short') {
		if (!dateTime) return
		return formatDate(dateTime, format, 'en-US')
	}
}
