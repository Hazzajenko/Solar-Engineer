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
import { GridEventFactory } from '@grid-layout/data-access/utils'
import { GridEventResult } from '@grid-layout/data-access/actions'
import { getLocationsInBox } from './utils/get-locations-in-box'

@Injectable({
  providedIn: 'root',
})
export class MouseService {
  private projectsFacade = inject(ProjectsFacade)
  private result = new GridEventFactory()
  private blocksFacade = inject(BlocksFacade)
  private selectedFacade = inject(SelectedFacade)
  private gridFacade = inject(GridFacade)
  private multiFacade = inject(MultiFacade)

  async mouse(mouse: MouseEventRequest, multiState: MultiStateModel): Promise<GridEventResult> {
    mouse.event.preventDefault()
    mouse.event.stopPropagation()
    if (
      (mouse.event.type === 'mousedown' && multiState.locationStart) ||
      (mouse.event.type === 'mouseup' && !multiState.locationStart)
    ) {
      return this.result.error('already in mouse movement')
    }
    if (!mouse.event.altKey) {
      return this.result.error('mouse, !mouse.event.altKey')
    }

    const result = await this.gridModeSwitch(multiState, mouse.location)
    return result
    // return this.mouseRepository.updateState(result)
  }

  private async gridModeSwitch(
    multiState: MultiStateModel,
    location: string,
  ): Promise<GridEventResult> {
    const gridState = await this.gridFacade.gridState
    return match(gridState.gridMode)
      .with(GridMode.SELECT, async () => this.multiSelect(multiState, location))
      .with(GridMode.CREATE, async () => this.multiCreate(multiState, location))
      .otherwise(async () => this.result.error('switch (gridState.gridMode) default'))
  }

  private async multiSelect(
    multiState: MultiStateModel,
    location: string,
  ): Promise<GridEventResult> {
    if (!multiState.locationStart) {
      return this.result.action({ action: 'SELECT_START', data: { location } })
    }
    const locationArray = getLocationsInBox(multiState.locationStart, location)
    const ids = await this.blocksFacade.selectBlockIdsFromArray(locationArray)

    return this.result.action({ action: 'SELECT_FINISH', data: { location, ids } })
  }

  private async multiCreate(
    multiState: MultiStateModel,
    location: string,
  ): Promise<GridEventResult> {
    const createMode = await this.gridFacade.createMode

    if (!multiState.locationStart) {
      return this.result.action({
        action: 'CREATE_START_PANEL',
        data: { location, type: createMode },
      })
    }

    const locationArray = getLocationsInBox(multiState.locationStart, location)
    return this.createModeSwitch(createMode, locationArray, location)
  }

  private async createModeSwitch(
    createMode: BlockType,
    locationArray: string[],
    location: string,
  ): Promise<GridEventResult> {
    return await match(createMode)
      .with(BlockType.PANEL, async () => this.multiCreatePanel(locationArray, location))
      .otherwise(async () => this.result.error('createModeSwitch default'))
  }

  private async multiCreatePanel(
    locationArray: string[],
    location: string,
  ): Promise<GridEventResult> {
    const project = await this.projectsFacade.projectFromRoute
    if (!project) {
      return this.result.fatal('project is not defined')
    }
    const selectedStringId = await this.selectedFacade.selectedStringId
    const panels = locationArray.map((location) => {
      return new PanelModel({
        projectId: project?.id,
        location,
        stringId: selectedStringId ? selectedStringId : 'undefined',
        rotation: 0,
        type: BlockType.PANEL,
      })
    })

    return this.result.action({
      action: 'CREATE_FINISH_PANEL',
      data: { location, type: BlockType.PANEL, panels },
    })
  }
}
