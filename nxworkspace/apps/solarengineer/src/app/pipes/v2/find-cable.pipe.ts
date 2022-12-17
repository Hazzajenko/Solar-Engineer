import { Pipe, PipeTransform } from '@angular/core'
import { CableModel } from '../../projects/models/deprecated-for-now/cable.model'

@Pipe({
  name: 'findCable',
  standalone: true,
})
export class FindCablePipe implements PipeTransform {
  transform(cables: CableModel[], blockId: string): CableModel | undefined {
    if (!cables || !blockId) {
      return undefined
      // return panels
    }

    // return cables.find((cable) => cable.location === blockId)
    return undefined
  }
}
