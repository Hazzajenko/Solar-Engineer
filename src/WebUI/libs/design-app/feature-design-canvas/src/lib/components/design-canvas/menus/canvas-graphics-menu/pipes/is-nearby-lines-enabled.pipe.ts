import { Pipe, PipeTransform } from '@angular/core'
import { NearbyGraphicsState } from '../+xstate'

@Pipe({
	name: 'isNearbyLinesEnabled', standalone: true,
})

export class IsNearbyLinesEnabledPipe
	implements PipeTransform {

	transform(state: NearbyGraphicsState): boolean {
		if (typeof state === 'string') return false
		return 'NearbyLinesEnabled' in state
	}
}