import { Pipe, PipeTransform } from '@angular/core'
import { PanelModel } from '../../models/panel.model'
import { TypeModel } from '../../models/type.model'

@Pipe({
  name: 'filterPanelsBy',
  standalone: true,
})
export class FilterPanelsByPipe implements PipeTransform {
  transform(panels: PanelModel[], id: string, unitModel: TypeModel): PanelModel[] {
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
      case TypeModel.STRING:
        return panels.filter((panel) => panel.stringId === id)
      default:
        return panels
    }
  }
}
