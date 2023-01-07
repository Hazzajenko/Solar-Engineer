import { inject, Injectable } from '@angular/core'
import { GridEventResult } from '@grid-layout/data-access/actions'

import {
  BlocksFacade, BlocksStoreService,
  GridFacade, PanelsFacade, PanelsStoreService,
} from '@project-id/data-access/facades'
import { BlockModel, BlockType, GridMode } from '@shared/data-access/models'
import { GridService } from 'libs/grid-layout/data-access/services/src/lib/entitites/grid'
import { PanelsService } from 'libs/grid-layout/data-access/services/src/lib/entitites/panels'
import { SelectedService } from 'libs/grid-layout/data-access/services/src/lib/entitites/selected'
import { StringsService } from 'libs/grid-layout/data-access/services/src/lib/entitites/strings'
import { MouseEventRequest } from 'libs/grid-layout/data-access/services/src/lib/mouse-event-request'
import { LinksService } from '../entitites/links/links.service'

@Injectable({
  providedIn: 'root',
})
export class DoubleClickService {
  private blocksStore = inject(BlocksStoreService)
  private panelsStore = inject(PanelsStoreService)
  private selectedFactory = inject(SelectedService)
  private stringsFactory = inject(StringsService)
  private gridFactory = inject(GridService)
  private panelsFactory = inject(PanelsService)
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
