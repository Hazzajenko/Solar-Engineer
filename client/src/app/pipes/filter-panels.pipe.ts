import { Pipe, PipeTransform } from '@angular/core';
import { PanelModel } from '../projects/models/panel.model';

@Pipe({
  name: 'filterPanels',
})
export class FilterPanelsPipe implements PipeTransform {
  transform(panels: PanelModel[], stringId: number): any {
    if (!panels || !stringId) {
      return panels;
    }
    // filter items array, items which match and return true will be
    // kept, false will be filtered out
    return panels.filter((panel) => panel.stringId === stringId);
  }
}
