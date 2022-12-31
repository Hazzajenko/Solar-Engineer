import { GridEventFactory } from '@grid-layout/data-access/utils'
import { inject, Injectable } from '@angular/core'
import {
  BlocksFacade,
  GridFacade,
  MultiFacade,
  PanelsFacade,
  SelectedFacade,
  StringsFacade,
} from '@project-id/data-access/store'
import { ProjectsFacade } from '@projects/data-access/store'
import { BlockModel, BlockType, GridMode, PanelModel } from '@shared/data-access/models'

import { match } from 'ts-pattern'
import { LinksRepository } from '../links/links.repository'
import { LinksService } from '../links/links.service'
import { ClickRepository } from './click.repository'
import { MouseEventRequest } from '@grid-layout/shared/models'
import { GridEventResult } from '@grid-layout/data-access/actions'

@Injectable({
  providedIn: 'root',
})
export class ClickService {
  private multiFacade = inject(MultiFacade)
  private result = new GridEventFactory()
  private gridFacade = inject(GridFacade)
  private blocksFacade = inject(BlocksFacade)
  private clickRepository = inject(ClickRepository)
  private projectsFacade = inject(ProjectsFacade)
  private linksRepository = inject(LinksRepository)
  private stringsFacade = inject(StringsFacade)
  private panelsFacade = inject(PanelsFacade)
  private selectedFacade = inject(SelectedFacade)
  private linksService = inject(LinksService)

  /**
 *
 * @param click - ClickEvent

 */
  async click(click: MouseEventRequest): Promise<GridEventResult> {
    if (click.event.altKey) {
      return this.result.error('click, click.event.altKey')
    }

    const existingBlock = await this.blocksFacade.blockByLocation(click.location)

    if (existingBlock) {
      const existingBlockResult = await this.existingBlockSwitch(click, existingBlock)
      return this.clickRepository.updateState(existingBlockResult)
    }
    const result = await this.gridModeSwitch(click.location)
    return this.clickRepository.updateState(result)
  }

  private async existingBlockSwitch(
    click: MouseEventRequest,
    existingBlock: BlockModel,
  ): Promise<GridEventResult> {
    return match(existingBlock.type)
      .with(BlockType.PANEL, async () => this.clickPanelSwitch(click, existingBlock))
      .otherwise(async () => this.result.error('unknown object for existingBlockSwitch'))
  }

  private async clickPanelSwitch(
    click: MouseEventRequest,
    existingBlock: BlockModel,
  ): Promise<GridEventResult> {
    const gridMode = await this.gridFacade.gridMode
    return match(gridMode)
      .with(GridMode.CREATE, async () =>
        this.result.action({ action: 'SELECT_PANEL', data: { panelId: existingBlock.id } }),
      )
      .with(GridMode.LINK, async () => this.linksService.addPanelToLink(click, existingBlock))
      .with(GridMode.SELECT, async () => this.selectPanel(click, existingBlock))
      .with(GridMode.DELETE, async () =>
        this.result.action({ action: 'DELETE_PANEL', data: { panelId: existingBlock.id } }),
      )
      .otherwise(async () => this.result.error('clickPanelSwitch, default'))
  }

  private async selectPanel(
    click: MouseEventRequest,
    existingBlock: BlockModel,
  ): Promise<GridEventResult> {
    const panel = await this.panelsFacade.panelById(existingBlock.id)
    if (!panel) {
      return this.result.fatal('selectPanel, !panel')
    }
    const selectedStringId = await this.selectedFacade.selectedStringId
    if (selectedStringId && selectedStringId === panel.stringId) {
      return this.result.action({
        action: 'SELECT_PANEL_WHEN_STRING_SELECTED',
        data: { panelId: panel.id },
      })
    }

    if (click.event.shiftKey) {
      return this.result.action({ action: 'ADD_PANEL_TO_MULTISELECT', data: { panelId: panel.id } })
    }

    return this.result.action({ action: 'SELECT_PANEL', data: { panelId: panel.id } })
  }

  private async gridModeSwitch(location: string): Promise<GridEventResult> {
    const gridMode = await this.gridFacade.gridMode
    return match(gridMode)
      .with(GridMode.CREATE, async () => this.createSwitch(location))
      .with(GridMode.LINK, async () =>
        this.result.action({
          action: 'SELECT_SELECT_MODE',
          data: { log: 'gridModeSwitch, link empty' },
        }),
      )
      .with(GridMode.SELECT, async () =>
        this.result.action({ action: 'CLEAR_SELECTED_STATE', data: { log: 'selectEmpty' } }),
      )
      .with(GridMode.DELETE, async () => this.result.error('gridModeSwitch, nothing to delete'))
      .otherwise(async () => this.result.error('gridModeSwitch, default'))
  }

  private async createSwitch(location: string): Promise<GridEventResult> {
    const createMode = await this.gridFacade.createMode
    return match(createMode)
      .with(BlockType.PANEL, async () => this.createPanelEvent(location))
      .otherwise(async () => this.result.error('createSwitch, default'))
  }

  private async createPanelEvent(location: string): Promise<GridEventResult> {
    const selectedStringId = await this.selectedFacade.selectedStringId
    const project = await this.projectsFacade.projectFromRoute
    if (!project) {
      return this.result.fatal('createPanelEvent, !project')
    }
    const panel = new PanelModel({
      projectId: project.id,
      stringId: selectedStringId ? selectedStringId : 'undefined',
      location,
      rotation: 0,
      type: BlockType.PANEL,
    })

    return this.result.action({ action: 'CREATE_PANEL', data: { panel } })
  }
}
