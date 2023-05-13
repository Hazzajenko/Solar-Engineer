import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
	name: 'convertTooltip',
	standalone: true,
})
export class ConvertTooltipPipe implements PipeTransform {
	transform(value: HTMLDivElement): string {
		console.log('value', value.innerHTML)
		// const html = new HTMLDivElement()
		// html.innerHTML = value.innerHTML
		// html.style.display = 'block'

		return value.innerHTML
	}
}
