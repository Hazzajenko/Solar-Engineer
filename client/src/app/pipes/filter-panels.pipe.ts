import { Pipe, PipeTransform } from '@angular/core'
import { PanelModel } from '../projects/models/panel.model'

@Pipe({
  name: 'filterPanels',
})
export class FilterPanelsPipe implements PipeTransform {
  transform(panels: PanelModel[], stringId: number): any {
    if (!panels || !stringId) {
      return panels
    }

    return panels.filter(
      (panel) => panel.string_id === stringId,
    )
  }
}
