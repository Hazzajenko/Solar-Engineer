import { Pipe, PipeTransform } from '@angular/core'
import { AngleDegrees, AngleRadians } from '@design-app/shared'
import { roundToTwoDecimals } from '@design-app/utils'

@Pipe({
	name: 'radiansToDegrees',
	standalone: true,
})
export class RadiansToDegreesPipe implements PipeTransform {
	transform(radians: AngleRadians): AngleDegrees {
		return roundToTwoDecimals((radians * 180) / Math.PI) as AngleDegrees
	}
}
