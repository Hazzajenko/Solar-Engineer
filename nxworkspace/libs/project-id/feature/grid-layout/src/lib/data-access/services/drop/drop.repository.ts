import { inject, Injectable } from '@angular/core'
import { Update } from '@ngrx/entity'
import { BlocksFacade, PanelsFacade } from '@project-id/data-access/store'
import { BlockModel, BlockType, PanelModel } from '@shared/data-access/models'
import { DropEventReturn } from './utils/drop.event'

@Injectable({
  providedIn: 'root',
})
export class DropRepository {
  private blocksFacade = inject(BlocksFacade)
  private panelsFacade = inject(PanelsFacade)

  async blockTypeSwitch(block: BlockModel, location: string): Promise<DropEventReturn> {
    switch (block.type) {
      case BlockType.PANEL: {
        const update: Update<PanelModel> = {
          id: block.id,
          changes: {
            location,
          },
        }
        this.panelsFacade.updatePanel(update)
        return new DropEventReturn({ action: 'UPDATE_PANEL', result: true })
      }
      default:
        return new DropEventReturn({ action: 'UNDEFINED', result: false, error: 'drop, default' })
    }
  }
}
