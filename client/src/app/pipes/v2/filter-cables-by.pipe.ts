import { Pipe, PipeTransform } from '@angular/core'
import { UnitModel } from '../../projects/models/unit.model'
import { CableModel } from '../../projects/models/cable.model'

@Pipe({
  name: 'filterCablesBy',
  standalone: true,
})
export class FilterCablesByPipe implements PipeTransform {
  transform(
    cables: CableModel[],
    id: number,
    unitModel: UnitModel,
  ): CableModel[] {
    if (!cables || !id || !unitModel) {
      return cables
    }

    switch (unitModel) {
      case UnitModel.PROJECT:
        return cables.filter((cable) => cable.project_id === id)
      default:
        return cables
    }
  }
}
