import { Pipe, PipeTransform } from '@angular/core'
import { GraphicsState } from '@design-app/data-access'
import { PickByValueExact } from 'utility-types'

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
