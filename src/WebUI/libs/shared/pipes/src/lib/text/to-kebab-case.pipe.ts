import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
	name: 'toKebabCase',
	standalone: true,
})
export class ToKebabCasePipe implements PipeTransform {
	transform(value: string) {
		return value
			.replace(/([a-z])([A-Z])/g, '$1-$2')
			.replace(/\s+/g, '-')
			.toLowerCase()
	}
}
