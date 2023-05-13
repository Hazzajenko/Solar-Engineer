import { Pipe, PipeTransform } from '@angular/core'
import { GraphicsStateMatchesModel } from '@design-app/data-access'


@Pipe({
	name: 'isNearbyLinesEnabled',
	standalone: true,
})
export class IsNearbyLinesEnabledPipe implements PipeTransform {
	transform(state: GraphicsStateMatchesModel['NearbyLinesState']): boolean {
		// transform(state: NearbyGraphicsState): boolean {
		if (!state) return false
		if (typeof state === 'string') return false
		return 'NearbyLinesEnabled' in state
	}
}