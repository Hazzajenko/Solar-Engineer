import { Pipe, PipeTransform } from '@angular/core'
import { PanelModel } from '../projects/models/panel.model'
import { UnitModel } from '../projects/models/unit.model'

@Pipe({
  name: 'filterPanelsBy',
})
export class FilterPanelsByPipe implements PipeTransform {
  transform(panels: PanelModel[], id: number, model: UnitModel): PanelModel[] {
    if (!panels || !id || !model) {
      return panels
    }

    switch (model) {
      case 1:
        return panels.filter((panel) => panel.inverter_id === id)
      case 2:
        return panels.filter((panel) => panel.tracker_id === id)
      case 3:
        return panels.filter((panel) => panel.string_id === id)
      default:
        return panels
    }
  }
}
