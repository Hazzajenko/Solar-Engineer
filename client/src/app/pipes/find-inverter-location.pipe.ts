import { Pipe, PipeTransform } from '@angular/core'
import { InverterModel } from '../projects/models/inverter.model'

@Pipe({
  name: 'findInverterLocation',
  standalone: true,
})
export class FindInverterLocationPipe implements PipeTransform {
  transform(
    inverters: InverterModel[],
    blockId: string,
  ): InverterModel | undefined {
    if (!inverters || !blockId) {
      return undefined
      // return panels
    }

    return inverters.find((inverter) => inverter.location === blockId)
    // return undefined
  }
}
