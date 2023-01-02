import { inject, Injectable } from '@angular/core'
import { GridEventResult } from '@grid-layout/data-access/actions'
import {
  GridEventFactory,
  GridFactory,
  MouseEventRequest,
  PanelFactory,
  SelectedFactory, StringFactory,
} from '@grid-layout/data-access/utils'
import {
  BlocksFacade,
  GridFacade, PanelsFacade,
} from '@project-id/data-access/facades'
import { BlockModel, BlockType, GridMode } from '@shared/data-access/models'
import { LinksService } from './links.service'

@Injectable({
  providedIn: 'root',
})
export class DoubleClickService {
  private eventFactory = inject(GridEventFactory)
  private gridFacade = inject(GridFacade)
  private blocksFacade = inject(BlocksFacade)
  private panelsFacade = inject(PanelsFacade)
  private selectedFactory = inject(SelectedFactory)
  private stringFactory = inject(StringFactory)
  private gridFactory = inject(GridFactory)
  private panelFactory = inject(PanelFactory)
  private linksService = inject(LinksService)

  async doubleCLick(click: MouseEventRequest) {
    if (click.event.type !== 'dblclick') {
      return this.eventFactory.undefined('not a double click')
    }

    const existingBlock = await this.blocksFacade.blockByLocation(click.location)

    if (!existingBlock) {
      return this.eventFactory.undefined('no double click events for no blocks')
    }

    return this.existingBlockSwitch(click, existingBlock)
  }

  async existingBlockSwitch(
    click: MouseEventRequest,
    existingBlock: BlockModel,
  ) {
    switch (existingBlock.type) {
      case BlockType.PANEL:
        return this.doubleClickPanel(existingBlock)
      default:
        return this.eventFactory.error('unknown object for existingBlockSwitch')
    }
  }

  private async doubleClickPanel(
    block: BlockModel,
  ) {
    const panel = await this.panelsFacade.panelById(block.id)
    if (!panel) {
      return this.eventFactory.fatal('should be panel')
    }
    if (panel.stringId === 'undefined') {
      return this.eventFactory.error('panel needs to have a string to double click')
    }
    return this.stringFactory.select(panel.stringId)
    // return this.eventFactory.action('SELECTED', panel.stringId)
  }
}
