import { inject, Injectable } from '@angular/core'

import {
  BlocksFacade,
  BlocksStoreService,
  GridFacade,
  GridStoreService,
  PanelsFacade,
  PanelsStoreService,
  LinksEventService,
  GridEventService,
  PanelsEventService,
  MouseEventRequest,

} from '../..'
import { BlockModel, BlockType, GridMode } from '@shared/data-access/models'
import { LoggerService } from '@shared/logger'


@Injectable({
  providedIn: 'root',
})
export class ClickService {
  private gridFacade = inject(GridFacade)
  private blocksFacade = inject(BlocksFacade)
  private panelsFacade = inject(PanelsFacade)
  private panelsStore = inject(PanelsStoreService)
  private blocksStore = inject(BlocksStoreService)
  private gridStore = inject(GridStoreService)
  private logger = inject(LoggerService)
  // private factory = inject(GlobalFactory)
  // private facade = inject(GridLayoutStoreService)

  private gridFactory = inject(GridEventService)
  private panelsFactory = inject(PanelsEventService)
  private linksService = inject(LinksEventService)

  async click(click: MouseEventRequest) {
    if (click.event.altKey) {
      return this.logger.debug({ source: 'ClickService', objects: ['click, click.event.altKey'] })
      // return console.error('click, click.event.altKey')
    }

    const existingBlock = await this.blocksStore.select.blockByLocation(click.location)

    if (existingBlock) {
      return this.existingBlockSwitch(click, existingBlock)
    }

    return this.gridModeSwitch(click.location)
  }

  async existingBlockSwitch(click: MouseEventRequest, existingBlock: BlockModel) {
    switch (existingBlock.type) {
      case BlockType.PANEL:
        return this.clickPanelSwitch(click, existingBlock)
      default:
        return this.logger.debug({ source: 'ClickService', objects: ['unknown object for existingBlockSwitch'] })
      // return console.error('unknown object for existingBlockSwitch')
    }
  }

  private async clickPanelSwitch(click: MouseEventRequest, block: BlockModel) {
    const panel = await this.panelsFacade.panelById(block.id)
    if (!panel) {
      return this.logger.debug({ source: 'ClickService', objects: ['should be panel'] })
      // return console.error('!(panel instanceof PanelModel)')
    }

    const gridMode = await this.gridFacade.gridMode
    if (gridMode === GridMode.LINK) {
      return this.linksService.addPanelToLink(click, panel)
    } /*

    const selectedStringId = await this.facade.selected.selectedStringId
    if (selectedStringId === panel.stringId) {

    }*/
    return await this.panelsFactory.selectPanel(panel, click.event.shiftKey)

    /*


        switch (gridMode) {
          // case GridMode.CREATE: return this.result.action({ action: 'SELECT_PANEL', data: { panelId: panel.id } })
          case GridMode.CREATE:
            return this.panelFactory.select(panel, click.event.shiftKey)
          case GridMode.LINK:
            return this.linksService.addPanelToLink(click, panel)
          case GridMode.SELECT:
            return this.panelFactory.select(panel, click.event.shiftKey)
    /!*      case GridMode.DELETE:
            return this.panelFactory.delete(panel.id)*!/
          default:
            return this.eventFactory.error('clickPanelSwitch, default')
        }*/
  }

  async gridModeSwitch(location: string) {
    const gridMode = await this.gridStore.select.gridMode
    switch (gridMode) {
      case GridMode.CREATE:
        return this.createSwitch(location)
      case GridMode.LINK:
        return this.gridFactory.select(GridMode.SELECT)
      case GridMode.SELECT:
        return this.createSwitch(location)
      // return this.selectedFactory.clearState()
      case GridMode.DELETE:
        return this.logger.debug({ source: 'ClickService', objects: ['gridModeSwitch, nothing to delete'] })
      // return console.error('gridModeSwitch, nothing to delete')
      default:
        return this.logger.debug({ source: 'ClickService', objects: ['gridModeSwitch, default'] })
      // return console.error('gridModeSwitch, default')
    }
  }

  private async createSwitch(location: string) {
    // const isStringSelected = await this.facade.selected.selectedStringId
    /*    if (isStringSelected) {
          await this.factory.selected.clearState()
        }*/
    const createMode = await this.gridFacade.createMode
    switch (createMode) {
      case BlockType.PANEL:
        return this.panelsFactory.createPanel(location, 0)
      default:
        return this.logger.debug({ source: 'ClickService', objects: ['createSwitch, default'] })
      // return console.error('createSwitch, default')
    }
  }
}
