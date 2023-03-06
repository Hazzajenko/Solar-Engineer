import { CdkDragDrop } from '@angular/cdk/drag-drop'
import { inject, Injectable } from '@angular/core'
import { BlocksFacade, BlocksStoreService } from '../..'
import { BLOCK_TYPE, BlockModel, BlockType } from '@shared/data-access/models'
import { PanelsEventService } from '../panels'
import { LoggerService } from '@shared/logger'

// import { PanelsService } from 'libs/grid-layout/data-access/services/src/lib/entitites/panels'

@Injectable({
  providedIn: 'root',
})
export class DropService {
  private blocksFacade = inject(BlocksFacade)
  private blocksStore = inject(BlocksStoreService)
  private panelsFactory = inject(PanelsEventService)
  private logger = inject(LoggerService)

  async drop(drop: CdkDragDrop<BlockModel[]>) {
    drop.event.preventDefault()
    drop.event.stopPropagation()
    const existingBlock = await this.blocksStore.select.blockByLocation(drop.container.id)

    if (existingBlock) {
      this.logger.debug({ source: 'DropService', objects: ['drop, existingblock'] })
      return
      // return console.error('drop, existingblock')
    }
    const block: BlockModel = drop.item.data
    const location: string = drop.container.id
    return await this.blockTypeSwitch(block, location)
    // const result = await this.blockTypeSwitch(block, location)
    // return result
  }

  async blockTypeSwitch(block: BlockModel, location: string) {
    switch (block.type) {
      case BLOCK_TYPE.PANEL:
        return this.panelsFactory.updatePanel(block.id, { location })
      default:
        return this.logger.debug({ source: 'DropService', objects: ['blockTypeSwitch, default'] })
      // return console.error('blockTypeSwitch, default')
    }
  }
}
