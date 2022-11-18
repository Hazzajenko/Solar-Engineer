import { Pipe, PipeTransform } from '@angular/core'
import { PanelModel } from '../projects/models/panel.model'

@Pipe({
  name: 'findPanelLocation',
  standalone: true,
})
export class FindPanelLocationPipe implements PipeTransform {
  transform(panels: PanelModel[], blockId: string): PanelModel | undefined {
    if (!panels || !blockId) {
      return undefined
      // return panels
    }

    return panels.find((panel) => panel.location === blockId)
    // return undefined
  }
}
