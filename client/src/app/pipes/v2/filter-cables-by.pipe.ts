import { Pipe, PipeTransform } from '@angular/core'
import { TypeModel } from '../../projects/models/type.model'
import { CableModel } from '../../projects/models/deprecated-for-now/cable.model'

@Pipe({
  name: 'filterCablesBy',
  standalone: true,
})
export class FilterCablesByPipe implements PipeTransform {
  transform(cables: CableModel[], id: number, unitModel: TypeModel): CableModel[] {
    if (!cables || !id || !unitModel) {
      return cables
    }

    switch (unitModel) {
      case TypeModel.PROJECT:
        return cables.filter((cable) => cable.project_id === id)
      default:
        return cables
    }
  }
}
