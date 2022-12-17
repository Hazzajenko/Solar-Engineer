import { Pipe, PipeTransform } from '@angular/core'
import { PanelModel } from '../../../../../libs/shared/data-access/models/src/lib/panel.model'

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
