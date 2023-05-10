import { Pipe, PipeTransform } from '@angular/core'
import { CanvasPanel } from '@design-app/shared'
import { isTypeOfPanel } from '../panels.utils'

@Pipe({
	name: 'isTypeOfPanel',
	standalone: true,
})
export class IsTypeOfPanelPipe implements PipeTransform {
	transform(value: unknown): CanvasPanel | undefined {
		return isTypeOfPanel(value) ? value : undefined
	}
}
