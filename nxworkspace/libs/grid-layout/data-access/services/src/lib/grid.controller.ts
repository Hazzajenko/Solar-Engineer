import { CdkDragDrop } from '@angular/cdk/drag-drop'
import { inject, Injectable } from '@angular/core'
import { GridEventResult } from '@grid-layout/data-access/actions'
import { GridEventFactory, GridFactory, MouseEventRequest } from '@grid-layout/data-access/utils'
import { ControllerEvent } from '@grid-layout/shared/models'
import { BlocksFacade, MultiFacade } from '@project-id/data-access/facades'
import { BlockModel } from '@shared/data-access/models'
import { ClickService } from './click.service'
import { DropService } from './drop.service'
import { MouseService } from './mouse.service'

@Injectable({
  providedIn: 'root',
})
export class GridController {
  private multiFacade = inject(MultiFacade)
  private eventFactory = inject(GridEventFactory)
  private blocksFacade = inject(BlocksFacade)
  private gridFactory = inject(GridFactory)
  private clickService = inject(ClickService)
  private dropService = inject(DropService)
  private mouseService = inject(MouseService)

  async controller(event: ControllerEvent) {
    switch (event.type) {
      case 'CLICK':
        await this.click({ event: event.event, location: event.location })
        break
      case 'DROP':
        await this.drop(event.event)
        break
      case 'MOUSE':
        await this.mouse({ event: event.event, location: event.location })
        break
    }
  }

  private async click(click: MouseEventRequest): Promise<GridEventResult> {
    if (click.event.altKey) {
      return this.eventFactory.error('click, click.event.altKey')
    }

    const existingBlock = await this.blocksFacade.blockByLocation(click.location)

    if (existingBlock) {
      return this.clickService.existingBlockSwitch(click, existingBlock)
    }

    return this.clickService.gridModeSwitch(click.location)
  }

  private async drop(drop: CdkDragDrop<BlockModel[]>): Promise<GridEventResult> {
    drop.event.preventDefault()
    drop.event.stopPropagation()
    const existingBlock = await this.blocksFacade.blockByLocation(drop.container.id)

    if (existingBlock) {
      return this.eventFactory.error('drop, existingblock')
      // return this.dropRepository.updateState(this.result.error('drop, existingblock'))
    }
    const block: BlockModel = drop.item.data
    const location: string = drop.container.id
    const result = await this.dropService.blockTypeSwitch(block, location)
    return result
    // return this.dropRepository.updateState(result)
  }

  private async mouse(mouse: MouseEventRequest): Promise<GridEventResult> {
    mouse.event.preventDefault()
    mouse.event.stopPropagation()
    if (!mouse.event.altKey) {
      return this.gridFactory.updateXY({
        clientX: undefined,
        clientY: undefined,
      })
    }

    const multiState = await this.multiFacade.state
    if (mouse.event.type === 'mousedown' && !multiState.locationStart) {
      this.gridFactory.updateXY({
        clientX: mouse.event.clientX,
        clientY: mouse.event.clientY,
      })
    }

    if (mouse.event.type === 'mouseup' && multiState.locationStart) {
      this.gridFactory.updateXY({
        clientX: undefined,
        clientY: undefined,
      })
    }
    if (
      (mouse.event.type === 'mousedown' && multiState.locationStart) ||
      (mouse.event.type === 'mouseup' && !multiState.locationStart)
    ) {
      return this.eventFactory.undefined('already in mouse movement')
    }
    if (!mouse.event.altKey) {
      return this.eventFactory.undefined('mouse, !mouse.event.altKey')
    }
    return this.eventFactory.undefined('mouse, !mouse.event.altKey')
    // return this.mouseService.gridModeSwitch(multiState, mouse.location)
  }
}
