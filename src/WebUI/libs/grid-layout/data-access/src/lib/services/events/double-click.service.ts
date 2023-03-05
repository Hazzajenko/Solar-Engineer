import { inject, Injectable } from '@angular/core'
// import { GridEventResult } from '@grid-layout/data-access/actions'
import { BlocksStoreService, PanelsStoreService } from '../..'
import { BlockModel, BlockType } from '@shared/data-access/models'
import { SelectedEventService } from '../selected'
import { StringsEventService } from '../strings'
import { GridEventService } from '../grid'
import { PanelsEventService } from '../panels'
import { LinksEventService } from '../links'
import { MouseEventRequest } from '../../models'
import { LoggerService } from '@shared/logger'

@Injectable({
  providedIn: 'root',
})
export class DoubleClickService {
  private blocksStore = inject(BlocksStoreService)
  private panelsStore = inject(PanelsStoreService)
  private selectedFactory = inject(SelectedEventService)
  private stringsFactory = inject(StringsEventService)
  private gridFactory = inject(GridEventService)
  private panelsFactory = inject(PanelsEventService)
  private linksService = inject(LinksEventService)
  private logger = inject(LoggerService)

  async doubleCLick(doubleClick: MouseEventRequest) {
    if (doubleClick.event.type !== 'dblclick') {
      return
    }

    const existingBlock = await this.blocksStore.select.blockByLocation(doubleClick.location)

    if (!existingBlock) {
      this.logger.debug({ source: 'DoubleClickService', objects: ['no double click events for no blocks'] })
      return
      // return console.warn('no double click events for no blocks')
    }

    return this.existingBlockSwitch(doubleClick, existingBlock)
  }

  async existingBlockSwitch(click: MouseEventRequest, existingBlock: BlockModel) {
    switch (existingBlock.type) {
      case BlockType.PANEL:
        return this.doubleClickPanel(existingBlock)
      default:
        return this.logger.debug({ source: 'DoubleClickService', objects: ['unknown object for existingBlockSwitch'] })
      // return console.error('unknown object for existingBlockSwitch')
    }
  }

  private async doubleClickPanel(block: BlockModel) {
    const panel = await this.panelsStore.select.panelById(block.id)
    if (!panel) {
      return this.logger.debug({ source: 'DoubleClickService', objects: ['should be panel'] })
      // return
      // return console.error('should be panel')
    }
    if (panel.stringId === 'undefined') {
      return this.logger.debug({
        source: 'DoubleClickService',
        objects: ['panel needs to have a string to double click']
      })
      // return console.error('panel needs to have a string to double click')
    }
    return this.stringsFactory.select(panel.stringId)
    // return this.eventFactory.action('SELECTED', panel.stringId)
  }
}
