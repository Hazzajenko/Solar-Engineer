import { InverterModel } from './../../../../models/inverter.model'
import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'getInverter',
  standalone: true,
})
export class GetInverterPipe implements PipeTransform {
  transform(
    inverters?: InverterModel[],
    blockId?: string,
  ): InverterModel | undefined {
    if (!inverters || !blockId) {
      return undefined
    }

    return inverters.find((inverter) => inverter.location === blockId)
  }
}
