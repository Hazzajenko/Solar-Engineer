import { Pipe, PipeTransform } from '@angular/core'
import { CanvasPanel, StringId } from '@design-app/shared'

@Pipe({
	name: 'forObjectLoop',
	standalone: true,
})
export class ForObjectLoopPipe implements PipeTransform {
	transform(value: Record<StringId, CanvasPanel[]> | undefined, ...args: any[]) {
		if (value === undefined) {
			return undefined
		}
		const entries = Object.entries(value)
		const result = entries.map(([stringId, panels]) => {
			return {
				stringId,
				panels,
			}
		})
		return result
	}
}
