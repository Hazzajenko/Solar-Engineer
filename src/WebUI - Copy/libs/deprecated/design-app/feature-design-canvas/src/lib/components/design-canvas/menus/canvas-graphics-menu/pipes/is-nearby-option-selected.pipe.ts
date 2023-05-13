import { NearbyGraphicsState } from '../+xstate'
import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
	name: 'isNearbyOptionSelected',
	standalone: true,
})
export class IsNearbyOptionSelectedPipe implements PipeTransform {
	transform(state: NearbyGraphicsState): boolean {
		if (typeof state === 'string') return false
		return 'NearbyLinesEnabled' in state
	}
}
