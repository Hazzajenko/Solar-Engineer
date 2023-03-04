import { inject, Injectable } from '@angular/core'
import { BlocksStoreService, PanelsStoreService } from '@project-id/data-access/facades'
import { BlockModel, BlockType } from '@shared/data-access/models'

import { LinksService } from '../entitites'
import {
  GridEventService,
  PanelsEventService,
  SelectedEventService,
  StringsEventService,
} from '@grid-layout/data-access'
import { MouseEventRequest } from '../mouse-event-request'

// import { GridEventService } from '../../../../src/lib/services/grid/grid-event.service'

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
  private linksService = inject(LinksService)

  async doubleCLick(doubleClick: MouseEventRequest) {
    if (doubleClick.event.type !== 'dblclick') {
      return
    }

    const existingBlock = await this.blocksStore.select.blockByLocation(doubleClick.location)

    if (!existingBlock) {
      return console.warn('no double click events for no blocks')
    }

    return this.existingBlockSwitch(doubleClick, existingBlock)
  }

  async existingBlockSwitch(click: MouseEventRequest, existingBlock: BlockModel) {
    switch (existingBlock.type) {
      case BlockType.PANEL:
        return this.doubleClickPanel(existingBlock)
      default:
        return console.error('unknown object for existingBlockSwitch')
    }
  }

  private async doubleClickPanel(block: BlockModel) {
    const panel = await this.panelsStore.select.panelById(block.id)
    if (!panel) {
      return console.error('should be panel')
    }
    if (panel.stringId === 'undefined') {
      return console.error('panel needs to have a string to double click')
    }
    return this.stringsFactory.select(panel.stringId)
    // return this.eventFactory.action('SELECTED', panel.stringId)
  }
}
