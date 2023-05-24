import { Pipe, PipeTransform } from '@angular/core'
import { PanelModel } from '@entities/shared'
import { isTypeOfPanel } from '../utils'

@Pipe({
	name: 'isTypeOfPanel',
	standalone: true,
})
export class IsTypeOfPanelPipe implements PipeTransform {
	transform(value: unknown): PanelModel | undefined {
		return isTypeOfPanel(value) ? value : undefined
	}
}
