import { Pipe, PipeTransform } from '@angular/core'
import { CableModel } from 'src/app/projects(deprecated)/models/deprecated-for-now/cable.model'
import { SurroundingModel } from 'src/app/projects(deprecated)/models/surrounding.model'

@Pipe({
  name: 'getCablesInJoinLength',
  standalone: true,
})
export class GetCablesInJoinLengthPipe implements PipeTransform {
  constructor() {}

  transform(cable: CableModel, cables?: CableModel[]): number {
    if (!cable || !cables) {
      return 0
    }
    return cables.filter((cable) => cable.join_id === cable.join_id).length
  }
}
