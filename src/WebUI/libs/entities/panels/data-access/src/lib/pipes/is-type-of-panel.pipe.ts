import { Pipe, PipeTransform } from '@angular/core'
import { CanvasPanel } from '@entities/panels/data-access'
import { isTypeOfPanel } from '../utils'

@Pipe({
	name: 'isTypeOfPanel',
	standalone: true,
})
export class IsTypeOfPanelPipe implements PipeTransform {
	transform(value: unknown): CanvasPanel | undefined {
		return isTypeOfPanel(value) ? value : undefined
	}
}
