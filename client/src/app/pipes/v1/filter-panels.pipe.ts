import { Pipe, PipeTransform } from '@angular/core'
import { PanelModel } from '../../projects/models/panel.model'
import { TypeModel } from '../../projects/models/type.model'

@Pipe({
  name: 'filterPanels',
  standalone: true,
})
export class FilterPanelsPipe implements PipeTransform {
  transform(
    panels: PanelModel[],
    id: string,
    unitModel: TypeModel,
  ): PanelModel[] {
    if (!panels || !id || !unitModel) {
      return panels
    }

    switch (unitModel) {
      /*      case 'PROJECT':
              return panels.filter((panel) => panel.project_id === id)*/
      case 'INVERTER':
        return panels.filter((panel) => panel.inverter_id === id)
      case 'TRACKER':
        return panels.filter((panel) => panel.tracker_id === id)
      /*      case 'STRING':
              return panels.filter((panel) => panel.string_id === id)*/
      default:
        return panels
    }
  }
}
