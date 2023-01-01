import { inject, Injectable } from '@angular/core'
import { GridEventResult } from '@grid-layout/data-access/actions'
import {
  GridEventFactory,
  GridFactory,
  PanelFactory,
  SelectedFactory,
} from '@grid-layout/data-access/utils'
import { MouseEventRequest } from '@grid-layout/shared/models'
import {
  BlocksFacade,
  GridFacade,
  MultiFacade,
  PanelsFacade,
  StringsFacade,
} from '@project-id/data-access/facades'
import { ProjectsFacade } from '@projects/data-access/facades'
import { BlockModel, BlockType, GridMode, PanelModel } from '@shared/data-access/models'
import { P } from 'ts-pattern'
import { LinksService } from '../links/links.service'

@Injectable({
  providedIn: 'root',
})
export class ClickService {
  private multiFacade = inject(MultiFacade)
  // private result = new GridEventFactory()
  private eventFactory = inject(GridEventFactory)
  private gridFacade = inject(GridFacade)
  private blocksFacade = inject(BlocksFacade)
  private projectsFacade = inject(ProjectsFacade)
  private stringsFacade = inject(StringsFacade)
  private panelsFacade = inject(PanelsFacade)
  private selectedFactory = inject(SelectedFactory)
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

  private async existingBlockSwitch(
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

    switch (gridMode) {
      // case GridMode.CREATE: return this.result.action({ action: 'SELECT_PANEL', data: { panelId: panel.id } })
      case GridMode.CREATE:
        return this.panelFactory.select(panel, click.event.shiftKey)
      case GridMode.LINK:
        return this.linksService.addPanelToLink(click, panel)
      case GridMode.SELECT:
        return this.panelFactory.select(panel, click.event.shiftKey)
      case GridMode.DELETE:
        return this.panelFactory.delete(panel.id)
      default:
        return this.eventFactory.error('clickPanelSwitch, default')
    }
  }

  private async gridModeSwitch(location: string): Promise<GridEventResult> {
    const gridMode = await this.gridFacade.gridMode
    switch (gridMode) {
      case GridMode.CREATE:
        return this.createSwitch(location)
      case GridMode.LINK:
        return this.gridFactory.select(GridMode.SELECT)
      case GridMode.SELECT:
        return this.selectedFactory.clearState()
      case GridMode.DELETE:
        return this.eventFactory.error('gridModeSwitch, nothing to delete')
      default:
        return this.eventFactory.error('gridModeSwitch, default')
    }
  }

  private async createSwitch(location: string): Promise<GridEventResult> {
    const createMode = await this.gridFacade.createMode
    switch (createMode) {
      case BlockType.PANEL:
        return this.panelFactory.create(location, 0)
      default:
        return this.eventFactory.error('createSwitch, default')
    }
  }

  private assertThisIsPanel(panel: BlockModel): asserts this is this & {
    panel: PanelModel
  } {
    if (!(panel instanceof PanelModel)) {
      throw new Error()
    }
  }
}
