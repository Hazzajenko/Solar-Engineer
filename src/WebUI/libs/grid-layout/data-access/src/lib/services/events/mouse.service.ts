import { inject, Injectable } from '@angular/core'

import { BlocksFacade, GridFacade, MultiFacade, MultiStoreService } from '../..'
import { MultiStateModel } from '../../models'
import { ProjectsFacade } from '@projects/data-access'
import { BlockType, GridMode } from '@shared/data-access/models'
import { MultiEventService } from '../multi'
import { MouseEventRequest } from '../../models'
import { getLocationsInBox } from '../utils'

@Injectable({
  providedIn: 'root',
})
export class MouseService {
  private projectsFacade = inject(ProjectsFacade)

  // private eventFactory = new GridEventFactory()
  private blocksFacade = inject(BlocksFacade)
  private multiFacade = inject(MultiFacade)
  private multiFactory = inject(MultiEventService)
  private multiStore = inject(MultiStoreService)

  private gridFacade = inject(GridFacade)

  async mouse(mouse: MouseEventRequest) {
    const multiState = await this.multiStore.select.state
    /*

        if (mouse.event.type === 'mousedown' && !multiState.locationStart) {
          this.uiRepository.setClientXY({
            clientX: mouse.event.clientX,
            clientY: mouse.event.clientY,
          })
          await this.gridFactory.updateXY({
            clientX: mouse.event.clientX,
            clientY: mouse.event.clientY,
          })
        }*/

    if (mouse.event.type === 'mouseup' && multiState.locationStart) {
      /*      this.uiRepository.setClientXY({
              clientX: undefined,
              clientY: undefined,
            })*/
      /*      await this.gridFactory.updateXY({
              clientX: undefined,
              clientY: undefined,
            })*/
    }
    if (
      (mouse.event.type === 'mousedown' && multiState.locationStart) ||
      (mouse.event.type === 'mouseup' && !multiState.locationStart)
    ) {
      // return this.eventFactory.undefined('already in mouse movement')
      return console.error('already in mouse movement')
    }
    if (!mouse.event.altKey) {
      return console.error('mouse, !mouse.event.altKey')
      // return this.eventFactory.undefined('mouse, !mouse.event.altKey')
    }

    return this.gridModeSwitch(multiState, mouse.location)
  }

  private async gridModeSwitch(multiState: MultiStateModel, location: string) {
    const gridMode = await this.gridFacade.gridMode
    switch (gridMode) {
      case GridMode.SELECT:
        return this.multiFactory.multiSelect(multiState.locationStart, location)
      case GridMode.CREATE:
        return this.create(multiState, location)
      default:
        return console.error(`cannot drag with gridmode ${gridMode}`)
      // return this.eventFactory.error(`cannot drag with gridmode ${gridMode}`)
    }
  }

  private async create(multiState: MultiStateModel, location: string) {
    const createMode = await this.gridFacade.createMode

    if (!multiState.locationStart) {
      return this.multiFactory.createStart(location, createMode)
    }

    const locationArray = getLocationsInBox(multiState.locationStart, location)

    const anyExistingInArray = await this.blocksFacade.anyBlocksInArray(locationArray)

    if (anyExistingInArray.length > 1) {
      return this.multiFactory.multiSelect(multiState.locationStart, location)
      // return this.eventFactory.error('blocks already in this space, cannot create')
    }

    switch (createMode) {
      case BlockType.PANEL:
        return this.multiFactory.createBlocks(createMode, locationArray, location)
      default:
        return console.error(`cannot multi create with type ${createMode}`)
    }
  }
}
