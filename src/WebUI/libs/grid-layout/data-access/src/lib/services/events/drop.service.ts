import { CdkDragDrop } from '@angular/cdk/drag-drop'
import { inject, Injectable } from '@angular/core'
import { BlocksFacade, BlocksStoreService } from '@project-id/data-access/facades'
import { BlockModel, BlockType } from '@shared/data-access/models'
import { PanelsEventService } from '../panels'

// import { PanelsService } from 'libs/grid-layout/data-access/services/src/lib/entitites/panels'

@Injectable({
  providedIn: 'root',
})
export class DropService {
  private blocksFacade = inject(BlocksFacade)
  private blocksStore = inject(BlocksStoreService)
  private panelsFactory = inject(PanelsEventService)

  async drop(drop: CdkDragDrop<BlockModel[]>) {
    drop.event.preventDefault()
    drop.event.stopPropagation()
    const existingBlock = await this.blocksStore.select.blockByLocation(drop.container.id)

    if (existingBlock) {
      return console.error('drop, existingblock')
    }
    const block: BlockModel = drop.item.data
    const location: string = drop.container.id
    const result = await this.blockTypeSwitch(block, location)
    return result
  }

  async blockTypeSwitch(block: BlockModel, location: string) {
    switch (block.type) {
      case BlockType.PANEL:
        return this.panelsFactory.updatePanel(block.id, { location })
      default:
        return console.error('blockTypeSwitch, default')
    }
  }
}
