import { GridFactory, MouseEventRequest } from '@grid-layout/data-access/utils'
import { inject, Injectable } from '@angular/core'
import { GridEventResult } from '@grid-layout/data-access/actions'
import { GridEventFactory, MultiFactory } from '@grid-layout/data-access/utils'

import { BlocksFacade, GridFacade, MultiFacade, PanelsFacade } from '@project-id/data-access/facades'
import { MultiStateModel } from '@project-id/shared/models'
import { ProjectsFacade } from '@projects/data-access/facades'
import { BlockType, GridMode } from '@shared/data-access/models'
import { getLocationsInBox } from './utils/get-locations-in-box'

@Injectable({
  providedIn: 'root',
})
export class MouseService {
  private projectsFacade = inject(ProjectsFacade)
  private eventFactory = inject(GridEventFactory)
  // private eventFactory = new GridEventFactory()
  private blocksFacade = inject(BlocksFacade)
  private multiFacade = inject(MultiFacade)
  private gridFactory = inject(GridFactory)
  private multiFactory = inject(MultiFactory)
  private gridFacade = inject(GridFacade)

  async mouse(mouse: MouseEventRequest): Promise<GridEventResult> {
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
      await this.gridFactory.updateXY({
        clientX: mouse.event.clientX,
        clientY: mouse.event.clientY,
      })
    }

    if (mouse.event.type === 'mouseup' && multiState.locationStart) {
      await this.gridFactory.updateXY({
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

    return this.gridModeSwitch(multiState, mouse.location)
  }

  private async gridModeSwitch(multiState: MultiStateModel, location: string): Promise<GridEventResult> {
    const gridMode = await this.gridFacade.gridMode
    switch (gridMode) {
      case GridMode.SELECT:
        return this.multiFactory.select(multiState.locationStart, location)
      case GridMode.CREATE:
        return this.create(multiState, location)
      default:
        return this.eventFactory.error(`cannot drag with gridmode ${gridMode}`)
    }
  }

  private async create(multiState: MultiStateModel, location: string): Promise<GridEventResult> {
    const createMode = await this.gridFacade.createMode

    if (!multiState.locationStart) {
      return this.multiFactory.createStart(location, createMode)
    }

    const locationArray = getLocationsInBox(multiState.locationStart, location)

    const anyExistingInArray = await this.blocksFacade.anyBlocksInArray(locationArray)

    if (anyExistingInArray.length > 1) {
      return this.multiFactory.select(multiState.locationStart, location)
      // return this.eventFactory.error('blocks already in this space, cannot create')
    }

    switch (createMode) {
      case BlockType.PANEL:
        return this.multiFactory.createBlocks(createMode, locationArray, location)
      default:
        return this.eventFactory.error(`cannot multi create with type ${createMode}`)
    }
  }
}
