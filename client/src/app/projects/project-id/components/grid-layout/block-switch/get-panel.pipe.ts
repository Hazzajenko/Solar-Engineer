import { Pipe, PipeTransform } from '@angular/core'
import { PanelModel } from 'src/app/projects/models/panel.model'

@Pipe({
  name: 'getPanel',
  standalone: true,
})
export class GetPanelPipe implements PipeTransform {
  transform(panels?: PanelModel[], blockId?: string): PanelModel | undefined {
    if (!panels || !blockId) {
      return undefined
    }

    return panels.find((panel) => panel.location === blockId)
  }
}
