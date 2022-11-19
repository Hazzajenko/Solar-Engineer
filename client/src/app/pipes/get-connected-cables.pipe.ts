import { Pipe, PipeTransform } from '@angular/core'
import { CableModel } from '../projects/models/cable.model'

@Pipe({
  name: 'getCableSurroundings',
  standalone: true,
})
export class GetCableSurroundingsPipe implements PipeTransform {
  transform(cable: CableModel, connectedCables: CableModel[]): number {
    // if (!row || !col) {
    //   return 0
    // }

    return 1
  }
}
