import { Pipe, PipeTransform } from '@angular/core'

export const pluralize = (word: string, count: number) => {
	if (count === 1) return word
	return word + 's'
}

@Pipe({
	name: 'pluralize',
	standalone: true,
})
export class PluralizePipe implements PipeTransform {
	transform(word: string | undefined | null, count: number) {
		if (!word) return ''
		return pluralize(word, count)
	}
}
