import { inject, Injectable } from '@angular/core'
import { GridEventResult } from '@grid-layout/data-access/actions'

import {
  BlocksFacade, BlocksStoreService,
  GridFacade, PanelsFacade, PanelsStoreService,
} from '@project-id/data-access/facades'
import { BlockModel, BlockType, GridMode } from '@shared/data-access/models'
import { GridFactory } from 'libs/grid-layout/data-access/services/src/lib/entitites/grid'
import { PanelsFactory } from 'libs/grid-layout/data-access/services/src/lib/entitites/panels'
import { SelectedFactory } from 'libs/grid-layout/data-access/services/src/lib/entitites/selected'
import { StringsFactory } from 'libs/grid-layout/data-access/services/src/lib/entitites/strings'
import { MouseEventRequest } from 'libs/grid-layout/data-access/services/src/lib/mouse-event-request'
import { LinksService } from '../entitites/links/links.service'

@Injectable({
  providedIn: 'root',
})
export class DoubleClickService {
  private blocksStore = inject(BlocksStoreService)
  private panelsStore = inject(PanelsStoreService)
  private selectedFactory = inject(SelectedFactory)
  private stringsFactory = inject(StringsFactory)
  private gridFactory = inject(GridFactory)
  private panelsFactory = inject(PanelsFactory)
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

  async existingBlockSwitch(
    click: MouseEventRequest,
    existingBlock: BlockModel,
  ) {
    switch (existingBlock.type) {
      case BlockType.PANEL:
        return this.doubleClickPanel(existingBlock)
      default:
        return console.error('unknown object for existingBlockSwitch')
    }
  }

  private async doubleClickPanel(
    block: BlockModel,
  ) {
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
