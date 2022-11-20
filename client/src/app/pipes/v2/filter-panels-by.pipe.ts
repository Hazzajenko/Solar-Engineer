import { Pipe, PipeTransform } from '@angular/core'
import { PanelModel } from '../../projects/models/panel.model'
import { UnitModel } from '../../projects/models/unit.model'

@Pipe({
  name: 'filterPanelsBy',
  standalone: true,
})
export class FilterPanelsByPipe implements PipeTransform {
  transform(
    panels: PanelModel[],
    id: string,
    unitModel: UnitModel,
  ): PanelModel[] {
    if (!panels || !id || !unitModel) {
      return panels
    }

    switch (unitModel) {
      /*      case UnitModel.PROJECT:
              return panels.filter((panel) => panel.project_id === id)
            case UnitModel.INVERTER:
              return panels.filter((panel) => panel.inverter_id === id)
            case UnitModel.TRACKER:
              return panels.filter((panel) => panel.tracker_id === id)*/
      case UnitModel.STRING:
        return panels.filter((panel) => panel.string_id === id)
      default:
        return panels
    }
  }
}
