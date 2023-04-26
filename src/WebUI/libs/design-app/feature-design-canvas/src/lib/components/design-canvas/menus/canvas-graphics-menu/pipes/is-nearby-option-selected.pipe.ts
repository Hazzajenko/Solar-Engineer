import { Pipe, PipeTransform } from '@angular/core'
import { NearbyGraphicsState } from '../+xstate'

@Pipe({
	name: 'isNearbyOptionSelected', standalone: true,
})

export class IsNearbyOptionSelectedPipe
	implements PipeTransform {

	transform(state: NearbyGraphicsState): boolean {
		if (typeof state === 'string') return false
		return 'NearbyLinesEnabled' in state
	}
}