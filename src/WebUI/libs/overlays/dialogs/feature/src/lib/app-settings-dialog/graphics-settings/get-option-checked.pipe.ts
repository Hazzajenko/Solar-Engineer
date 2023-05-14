import { Pipe, PipeTransform } from '@angular/core'
import { PickByValueExact } from 'utility-types'
import { GraphicsState } from '@canvas/graphics/data-access'

export type GraphicsStateBooleans = PickByValueExact<GraphicsState, boolean>
export type GraphicsStateBooleansKeys = keyof GraphicsStateBooleans

@Pipe({
	name: 'getOptionChecked',
	standalone: true,
})
export class GetOptionCheckedPipe implements PipeTransform {
	transform(state: GraphicsStateBooleans, stateValue: GraphicsStateBooleansKeys): boolean {
		return state[stateValue as keyof GraphicsStateBooleans]
	}
}
