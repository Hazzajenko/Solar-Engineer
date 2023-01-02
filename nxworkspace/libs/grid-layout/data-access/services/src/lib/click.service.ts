import { inject, Injectable } from '@angular/core'
import { GridEventResult } from '@grid-layout/data-access/actions'
import {
  GlobalFactory,
  GridEventFactory,
  GridFactory,
  MouseEventRequest,
  PanelFactory,
} from '@grid-layout/data-access/utils'
import { BlocksFacade, GlobalFacade, GridFacade, PanelsFacade } from '@project-id/data-access/facades'
import { BlockModel, BlockType, GridMode } from '@shared/data-access/models'
import { LinksService } from './links.service'

@Injectable({
  providedIn: 'root',
})
export class ClickService {
  private eventFactory = inject(GridEventFactory)
  private gridFacade = inject(GridFacade)
  private blocksFacade = inject(BlocksFacade)
  private panelsFacade = inject(PanelsFacade)
  private factory = inject(GlobalFactory)
  private facade = inject(GlobalFacade)

  private gridFactory = inject(GridFactory)
  private panelFactory = inject(PanelFactory)
  private linksService = inject(LinksService)

  async click(click: MouseEventRequest): Promise<GridEventResult> {
    if (click.event.altKey) {
      return this.eventFactory.error('click, click.event.altKey')
    }

    const existingBlock = await this.blocksFacade.blockByLocation(click.location)

    if (existingBlock) {
      return this.existingBlockSwitch(click, existingBlock)
    }

    return this.gridModeSwitch(click.location)
  }

  async existingBlockSwitch(
    click: MouseEventRequest,
    existingBlock: BlockModel,
  ): Promise<GridEventResult> {
    switch (existingBlock.type) {
      case BlockType.PANEL:
        return this.clickPanelSwitch(click, existingBlock)
      default:
        return this.eventFactory.error('unknown object for existingBlockSwitch')
    }
  }

  private async clickPanelSwitch(
    click: MouseEventRequest,
    block: BlockModel,
  ): Promise<GridEventResult> {
    const panel = await this.panelsFacade.panelById(block.id)
    if (!panel) {
      return this.eventFactory.error('!(panel instanceof PanelModel)')
    }

    const gridMode = await this.gridFacade.gridMode
    if (gridMode === GridMode.LINK) {
      return this.linksService.addPanelToLink(click, panel)
    }/*

    const selectedStringId = await this.facade.selected.selectedStringId
    if (selectedStringId === panel.stringId) {

    }*/
    return this.panelFactory.select(panel, click.event.shiftKey)
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

  async gridModeSwitch(location: string): Promise<GridEventResult> {
    const gridMode = await this.gridFacade.gridMode
    switch (gridMode) {
      case GridMode.CREATE:
        return this.createSwitch(location)
      case GridMode.LINK:
        return this.gridFactory.select(GridMode.SELECT)
      case GridMode.SELECT:
        return this.createSwitch(location)
      // return this.selectedFactory.clearState()
      case GridMode.DELETE:
        return this.eventFactory.error('gridModeSwitch, nothing to delete')
      default:
        return this.eventFactory.error('gridModeSwitch, default')
    }
  }

  private async createSwitch(location: string): Promise<GridEventResult> {
    // const isStringSelected = await this.facade.selected.selectedStringId
    /*    if (isStringSelected) {
          await this.factory.selected.clearState()
        }*/
    const createMode = await this.gridFacade.createMode
    switch (createMode) {
      case BlockType.PANEL:
        return this.panelFactory.create(location, 0)
      default:
        return this.eventFactory.error('createSwitch, default')
    }
  }
}
