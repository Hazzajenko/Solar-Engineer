import { inject, Injectable } from '@angular/core'
import { MultiStateModel } from '@project-id/shared/models'
import {
  BlocksFacade,
  GridFacade,
  MultiFacade,
  SelectedFacade,
} from '@project-id/data-access/facades'
import { ProjectsFacade } from '@projects/data-access/facades'
import { BlockType, GridMode, PanelModel } from '@shared/data-access/models'
import { match } from 'ts-pattern'
import { MouseEventRequest } from '@grid-layout/shared/models'
import { GridEventFactory, MultiFactory } from '@grid-layout/data-access/utils'
import { GridEventResult } from '@grid-layout/data-access/actions'
import { getLocationsInBox } from './utils/get-locations-in-box'

@Injectable({
  providedIn: 'root',
})
export class MouseService {
  private projectsFacade = inject(ProjectsFacade)
  private eventFactory = new GridEventFactory()
  private blocksFacade = inject(BlocksFacade)
  private multiFactory = inject(MultiFactory)
  private gridFacade = inject(GridFacade)


  async mouse(mouse: MouseEventRequest, multiState: MultiStateModel): Promise<GridEventResult> {
    mouse.event.preventDefault()
    mouse.event.stopPropagation()
    if (
      (mouse.event.type === 'mousedown' && multiState.locationStart) ||
      (mouse.event.type === 'mouseup' && !multiState.locationStart)
    ) {
      return this.eventFactory.error('already in mouse movement')
    }
    if (!mouse.event.altKey) {
      return this.eventFactory.error('mouse, !mouse.event.altKey')
    }

    return this.gridModeSwitch(multiState, mouse.location)
  }

  private async gridModeSwitch(
    multiState: MultiStateModel,
    location: string,
  ): Promise<GridEventResult> {
    const gridMode = await this.gridFacade.gridMode
    switch (gridMode) {
      case GridMode.SELECT:
        return this.multiFactory.select(multiState.locationStart, location)
      case GridMode.CREATE:
        return this.create(multiState, location)
      default:
        return this.eventFactory.error('switch (gridState.gridMode) default')
    }
  }

  private async create(multiState: MultiStateModel, location: string): Promise<GridEventResult> {
    const createMode = await this.gridFacade.createMode

    if (!multiState.locationStart) {
      return this.multiFactory.createStart(location, createMode)
    }

    const locationArray = getLocationsInBox(multiState.locationStart, location)
    switch (createMode) {
      case BlockType.PANEL:
        return this.multiFactory.createBlocks(createMode, locationArray, location)
      default:
        return this.eventFactory.error('createModeSwitch default')
    }
  }
}
