import { CdkDragDrop } from '@angular/cdk/drag-drop'
import { inject, Injectable } from '@angular/core'
import { GridEventResult } from '@grid-layout/data-access/actions'
import { GridEventFactory, PanelFactory } from '@grid-layout/data-access/utils'
import { BlocksFacade } from '@project-id/data-access/facades'
import { BlockModel, BlockType } from '@shared/data-access/models'

@Injectable({
  providedIn: 'root',
})
export class DropService {
  private eventFactory = inject(GridEventFactory)
  private blocksFacade = inject(BlocksFacade)
  private panelFactory = inject(PanelFactory)

  async drop(drop: CdkDragDrop<BlockModel[]>): Promise<GridEventResult> {
    drop.event.preventDefault()
    drop.event.stopPropagation()
    const existingBlock = await this.blocksFacade.blockByLocation(drop.container.id)

    if (existingBlock) {
      return this.eventFactory.error('drop, existingblock')
    }
    const block: BlockModel = drop.item.data
    const location: string = drop.container.id
    const result = await this.blockTypeSwitch(block, location)
    return result
  }

  async blockTypeSwitch(block: BlockModel, location: string): Promise<GridEventResult> {
    switch (block.type) {
      case BlockType.PANEL:
        return this.panelFactory.update(block.id, { location })
      default:
        return this.eventFactory.error('blockTypeSwitch, default')
    }
  }
}
