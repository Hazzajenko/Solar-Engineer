import { CableModel } from './../../../../models/cable.model'
import { Pipe, PipeTransform } from '@angular/core'
import { PanelModel } from 'src/app/projects/models/panel.model'

@Pipe({
  name: 'getCable',
  standalone: true,
})
export class GetCablePipe implements PipeTransform {
  transform(cables?: CableModel[], blockId?: string): CableModel | undefined {
    if (!cables || !blockId) {
      return undefined
    }

    return cables.find((cable) => cable.location === blockId)
  }
}
