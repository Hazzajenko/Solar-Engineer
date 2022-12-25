import { CdkDragDrop } from '@angular/cdk/drag-drop'
import { inject, Injectable } from '@angular/core'
import { Update } from '@ngrx/entity'
import { PanelsFacade } from '@project-id/data-access/store'
import {
  BlockModel,
  BlockType, PanelModel
} from '@shared/data-access/models'
import { BlocksFacade } from './../../../store/src/lib/blocks/blocks.facade'

@Injectable({
  providedIn: 'root',
})
export class GridService {
  private blocksFacade = inject(BlocksFacade)
  private panelsFacade = inject(PanelsFacade)

  gridDrop(event: CdkDragDrop<any, any>, existingBlock: BlockModel | undefined) {
    if (existingBlock) {
      return console.warn(`block already exists as ${event.container.id}`)
    }

    const block: BlockModel = event.item.data
    const location = event.container.id

    switch (block.type) {
      case BlockType.PANEL: {
        const panel: Update<PanelModel> = {
          id: block.id,
          changes: {
            location,
          },
        }
        return this.panelsFacade.updatePanel(panel)
      }

      default:
        break
    }
  }
}
