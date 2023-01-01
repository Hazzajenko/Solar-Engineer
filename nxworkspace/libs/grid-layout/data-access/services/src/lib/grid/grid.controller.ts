import { GridClick } from '@grid-layout/data-access/utils'
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
import { BlockModel, BlockType, GridMode } from '@shared/data-access/models'
import { match } from 'ts-pattern'
import { ControllerEvent, DragDropEvent, MouseMoveEvent } from './types'

@Injectable({
  providedIn: 'root',
})
export class GridController {
  private multiFacade = inject(MultiFacade)
  private result = new GridEventFactory()
  private gridFacade = inject(GridFacade)
  private blocksFacade = inject(BlocksFacade)
  private projectsFacade = inject(ProjectsFacade)
  private stringsFacade = inject(StringsFacade)
  private panelsFacade = inject(PanelsFacade)
  private selectedFacade = inject(SelectedFacade)
  private linksService = inject(LinksService)
  private clickPanel = inject(ClickPanelService)
  private clickCreate = inject(ClickCreate)



  async controller(event: ControllerEvent) {
    return match(event)
      .with(MouseEventRequest, async () => this.clickCreate.createSwitch(location))
      .with(GridMode.LINK, async () => this.gridModeLink())
      .with(GridMode.SELECT, async () => this.gridModeSelect())
      .with(GridMode.DELETE, async () => this.gridModeDelete())
      .otherwise(async () => this.gridModeDefault())
  }
  /**
 *
 * @param click - ClickEvent

 */
  // async click(click: GridClick): Promise<GridEventResult> {
  async click(click: MouseEventRequest): Promise<GridEventResult> {
    if (click.event.altKey) {
      return this.result.error('click, click.event.altKey')
    }

    const existingBlock = await this.blocksFacade.blockByLocation(click.location)

    if (existingBlock) {
      return this.existingBlockSwitch(click, existingBlock)
    }

    return this.gridModeSwitch(click.location)
  }

  async drop(drop: DragDropEvent): Promise<GridEventResult> {
    drop.event.preventDefault()
    drop.event.stopPropagation()
    const existingBlock = await this.blocksFacade.blockByLocation(drop.container.id)

    if (existingBlock) {
      return this.result.error('drop, existingblock')
      // return this.dropRepository.updateState(this.result.error('drop, existingblock'))
    }
    const block: BlockModel = drop.item.data
    const location: string = drop.container.id
    const result = await this.blockTypeSwitch(block, location)
    return result
    // return this.dropRepository.updateState(result)
  }

  async mouse(event: MouseMoveEvent): Promise<GridEventResult> {
    event.request.event.preventDefault()
    event.request.event.stopPropagation()
    if (
      (event.request.event.type === 'mousedown' && event.multiState.locationStart) ||
      (event.request.event.type === 'mouseup' && !event.multiState.locationStart)
    ) {
      return this.result.error('already in mouse movement')
    }
    if (!event.request.event.altKey) {
      return this.result.error('mouse, !mouse.event.altKey')
    }

    return this.gridModeSwitch(event.multiState, event.request.location)
    // const result = await this.gridModeSwitch(multiState, mouse.location)
    // return result
    // return this.mouseRepository.updateState(result)
  }


}
