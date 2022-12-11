import { Pipe, PipeTransform } from '@angular/core'
import { CableModel } from '../projects/models/deprecated-for-now/cable.model'

@Pipe({
  name: 'getCablesInJoin',
  standalone: true,
})
export class GetCablesInJoinPipe implements PipeTransform {
  constructor() {}

  transform(cable: CableModel, cables: CableModel[]): CableModel[] {
    return cables.filter(
      (cableInJoin) => cableInJoin.join_id === cable.join_id,
    )!
  }
}
