import { inject, Injectable } from '@angular/core'
import {
  BlocksFacade,
  GridFacade,
  MultiFacade,
  MultiState,
  SelectedFacade,
} from '@project-id/data-access/store'
import { ProjectsFacade } from '@projects/data-access/store'
import { BlockType, GridMode, PanelModel } from '@shared/data-access/models'
import { match } from 'ts-pattern'
import { MouseEventRequest } from '../utils/events/mouse.event'
import { GridEventFactory, GridEventResult } from '../utils/grid.factory'

import { MouseRepository } from './mouse.repository'
import { getLocationsInBox } from './utils/get-locations-in-box'

@Injectable({
  providedIn: 'root',
})
export class MouseService {
  private projectsFacade = inject(ProjectsFacade)
  private result = new GridEventFactory().mouseEvents()
  private blocksFacade = inject(BlocksFacade)
  private selectedFacade = inject(SelectedFacade)
  private gridFacade = inject(GridFacade)
  private multiFacade = inject(MultiFacade)
  private mouseRepository = inject(MouseRepository)

  async mouse(mouse: MouseEventRequest, multiState: MultiState): Promise<GridEventResult> {
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
    } /*
    if (mouse.event.type === 'mousedown' && multiState.locationStart) {
      return this.result.undefined()
      return new MouseEventReturn({
        action: 'UNDEFINED',
        result: false,
        error: 'mouse, mouse.event.type === mousedown && multiState.locationStart',
      })
    }
    if (mouse.event.type === 'mouseup' && !multiState.locationStart) {
      return this.result.undefined()
      return new MouseEventReturn({
        action: 'UNDEFINED',
        result: false,
        error: 'mouse, mouse.event.type === mouseup && !multiState.locationStart',
      })
    } */
    const result = await this.gridModeSwitch(multiState, mouse.location)
    return this.mouseRepository.updateState(result)
    /*     const gridState = await this.gridFacade.gridState
    // const gridState = await firstValueFrom(this.gridFacade.gridState$)
    switch (gridState.gridMode) {
      case GridMode.SELECT:
        return this.mouseRepository.multiSelect(mouse.location, multiState)
      case GridMode.CREATE:
        return this.mouseRepository.multiCreate(mouse.location, multiState)
      default:
        return this.result.error('switch (gridState.gridMode) default')
      /*         return new MouseEventReturn({
          action: 'UNDEFINED',
          result: false,
          error: 'mouse, default',
        })
    } */
  }

  private async gridModeSwitch(multiState: MultiState, location: string): Promise<GridEventResult> {
    const gridState = await this.gridFacade.gridState
    return await match(gridState.gridMode)
      .with(GridMode.SELECT, async () => this.multiSelect(multiState, location))
      .with(GridMode.CREATE, async () => this.multiCreate(multiState, location))
      .otherwise(async () => this.result.error('switch (gridState.gridMode) default'))
    /*     switch (block.type) {
      case BlockType.PANEL: {
        const update: Update<PanelModel> = {
          id: block.id,
          changes: {
            location,
          },
        }
        // this.panelsFacade.updatePanel(update)
        return this.result.action({ action: 'UPDATE_PANEL', data: { update } })
        // return this.result.action('UPDATE_PANEL')
        // return new DropEventReturn({ action: 'UPDATE_PANEL', result: true })
      }
      default:
        return this.result.error('blockTypeSwitch, default')
      // return new DropEventReturn({ action: 'UNDEFINED', result: false, error: 'drop, default' })
    } */
  }

  private async multiSelect(multiState: MultiState, location: string): Promise<GridEventResult> {
    if (!multiState.locationStart) {
      // this.multiFacade.startMultiSelect(location)
      return this.result.action({ action: 'SELECT_START', data: { location } })
      /*       return new MouseEventReturn({
        action: 'SELECT_START',
        result: true,
      }) */
    }
    const locationArray = getLocationsInBox(multiState.locationStart, location)
    const ids = await this.blocksFacade.selectBlockIdsFromArray(locationArray)
    // this.multiFacade.finishMultiSelect(location, ids)
    return this.result.action({ action: 'SELECT_FINISH', data: { location, ids } })
    // return this.result.action('SELECT_FINISH')
    /*     return new MouseEventReturn({
      action: 'SELECT_FINISH',
      result: true,
    }) */
  }

  private async multiCreate(multiState: MultiState, location: string): Promise<GridEventResult> {
    /*     const [createMode, project, selectedStringId] = await firstValueFrom(
      combineLatest([
        this.gridFacade.createMode$,
        this.projectsFacade.projectFromRoute$,
        this.selectedFacade.selectedStringId$,
      ]),
    ) */
    const createMode = await this.gridFacade.createMode

    if (!multiState.locationStart) {
      // this.multiFacade.startMultiCreate(location, createMode)
      return this.result.action({
        action: 'CREATE_START_PANEL',
        data: { location, type: createMode },
      })
      // return this.result.action('CREATE_START_PANEL')
      /*       return new MouseEventReturn({
        action: 'CREATE_START_PANEL',
        result: true,
      }) */
    }

    const locationArray = getLocationsInBox(multiState.locationStart, location)
    return this.createModeSwitch(createMode, locationArray, location)
    /*     switch (createMode) {
      case BlockType.PANEL: {
        const panels = locationArray.map((location) => {
          return new PanelModel({
            projectId: project?.id,
            location,
            stringId: selectedStringId ? selectedStringId : 'undefined',
            rotation: 0,
            type: BlockType.PANEL,
          })
        })
        this.multiFacade.finishMultiCreatePanels(location, BlockType.PANEL, panels)
        return this.result.action({
          action: 'CREATE_FINISH_PANEL',
          data: { location, type: BlockType.PANEL, panels },
        })
        // return this.result.action('CREATE_FINISH_PANEL')
        /*         return new MouseEventReturn({
          action: 'CREATE_FINISH_PANEL',
          result: true,
        })
      }
      default:
        return this.result.error('switch (createMode) default')
      /*         return new MouseEventReturn({
          action: 'UNDEFINED',
          result: false,
          error: 'multiCreate, default',
        })
    } */
  }

  private async createModeSwitch(
    createMode: BlockType,
    locationArray: string[],
    location: string,
  ): Promise<GridEventResult> {
    return await match(createMode)
      .with(BlockType.PANEL, async () => this.multiCreatePanel(locationArray, location))
      .otherwise(async () => this.result.error('createModeSwitch default'))
    /*     switch (block.type) {
      case BlockType.PANEL: {
        const update: Update<PanelModel> = {
          id: block.id,
          changes: {
            location,
          },
        }
        // this.panelsFacade.updatePanel(update)
        return this.result.action({ action: 'UPDATE_PANEL', data: { update } })
        // return this.result.action('UPDATE_PANEL')
        // return new DropEventReturn({ action: 'UPDATE_PANEL', result: true })
      }
      default:
        return this.result.error('blockTypeSwitch, default')
      // return new DropEventReturn({ action: 'UNDEFINED', result: false, error: 'drop, default' })
    } */
  }

  private async multiCreatePanel(
    locationArray: string[],
    location: string,
  ): Promise<GridEventResult> {
    const project = await this.projectsFacade.projectFromRoute
    if (!project) {
      return this.result.fatal('project is not defined')
      /*       return new MouseEventReturn({
        action: 'UNDEFINED',
        result: false,
        error: 'multiCreate, !project',
      }) */
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
    // this.multiFacade.finishMultiCreatePanels(location, BlockType.PANEL, panels)
    return this.result.action({
      action: 'CREATE_FINISH_PANEL',
      data: { location, type: BlockType.PANEL, panels },
    })
  }
}
