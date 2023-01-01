
import { GridClick, GridFactory, SelectedFactory } from '@grid-layout/data-access/utils'
import { GridEventFactory } from '@grid-layout/data-access/utils'
import { inject, Injectable } from '@angular/core'
import {
  BlocksFacade,
  GridFacade,
  MultiFacade,
  PanelsFacade,
  SelectedFacade,
  StringsFacade,
} from '@project-id/data-access/facades'
import { ProjectsFacade } from '@projects/data-access/facades'
import { LinksService } from '../links/links.service'
import { MouseEventRequest } from '@grid-layout/shared/models'
import { GridEventResult } from '@grid-layout/data-access/actions'
import { ClickPanelService } from './click-panel'
import { ClickCreate } from './click-create'
import { BlockModel, BlockType, GridMode } from '@shared/data-access/models'
import { match } from 'ts-pattern'

@Injectable({
  providedIn: 'root',
})
export class ClickService {
  private multiFacade = inject(MultiFacade)
  // private result = new GridEventFactory()
  private event = inject(GridEventFactory)
  private gridFacade = inject(GridFacade)
  private blocksFacade = inject(BlocksFacade)
  private projectsFacade = inject(ProjectsFacade)
  private stringsFacade = inject(StringsFacade)
  private panelsFacade = inject(PanelsFacade)
  private selectedFactory = inject(SelectedFactory)
  private gridFactory = inject(GridFactory)
  private clickPanel = inject(ClickPanelService)
  private clickCreate = inject(ClickCreate)

  /**
 *
 * @param click - ClickEvent

 */
  // async click(click: GridClick): Promise<GridEventResult> {
  async click(click: MouseEventRequest): Promise<GridEventResult> {
    if (click.event.altKey) {
      return this.event.error('click, click.event.altKey')
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
    return match(existingBlock.type)
      .with(BlockType.PANEL, async () => this.clickPanel.clickPanelSwitch(click, existingBlock))
      .otherwise(async () => this.event.error('unknown object for existingBlockSwitch'))
  }

  private async gridModeSwitch(location: string): Promise<GridEventResult> {
    const gridMode = await this.gridFacade.gridMode
    switch (gridMode){
      case GridMode.CREATE: return this.clickCreate.createSwitch(location)
      case GridMode.LINK: return this.gridFactory.select(GridMode.SELECT)
      case GridMode.SELECT: return this.selectedFactory.clearState()
      case GridMode.DELETE: return this.gridModeDelete()
      default: return this.gridModeDefault()
    }
/* /*     .with(GridMode.CREATE, async () => this.clickCreate.createSwitch(location))
    .with(GridMode.LINK, async () => this.gridModeLink())
    .with(GridMode.SELECT, async () => this.gridModeSelect())
    .with(GridMode.DELETE, async () => this.gridModeDelete())
    .otherwise(async () => this.gridModeDefault())
    return match(gridMode)
      .with(GridMode.CREATE, async () => this.clickCreate.createSwitch(location))
      .with(GridMode.LINK, async () => this.gridModeLink())
      .with(GridMode.SELECT, async () => this.gridModeSelect())
      .with(GridMode.DELETE, async () => this.gridModeDelete())
      .otherwise(async () => this.gridModeDefault()) */
  }

/*   private async gridModeLink() {
    // this.gridFacade.selectLinkMode()
    return this.event.action({
      action: 'SELECT_SELECT_MODE',
      data: { log: 'gridModeSwitch, link empty' },
    })
  }

  private async gridModeSelect() {
    // this.gridFacade.selectSelectMode()
    return this.event.action({ action: 'CLEAR_SELECTED_STATE', data: { log: 'selectEmpty' } })
  } */

  private async gridModeDelete() {
    // this.gridFacade.selectDeleteMode()
    return this.event.error('gridModeSwitch, nothing to delete')
  }

  private async gridModeDefault() {
    return this.event.error('gridModeSwitch, default')
  }
}
