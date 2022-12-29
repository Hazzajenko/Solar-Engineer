import { inject, Injectable } from '@angular/core'
import {
  BlocksFacade,
  GridFacade,
  MultiFacade,
  MultiState,
  SelectedFacade
} from '@project-id/data-access/store'
import { ProjectsFacade } from '@projects/data-access/store'
import { BlockType, PanelModel } from '@shared/data-access/models'
import { combineLatest, firstValueFrom } from 'rxjs'

import { getLocationsInBox } from './utils/get-locations-in-box'
import {
  MouseEventReturn
} from './utils/mouse.event'

@Injectable({
  providedIn: 'root',
})
export class MouseRepository {
  private projectsFacade = inject(ProjectsFacade)

  private blocksFacade = inject(BlocksFacade)
  private selectedFacade = inject(SelectedFacade)
  private gridFacade = inject(GridFacade)
  private multiFacade = inject(MultiFacade)

  async multiSelect(location: string, multiState: MultiState): Promise<MouseEventReturn> {
    if (!multiState.locationStart) {
      this.multiFacade.startMultiSelect(location)
      return new MouseEventReturn({
        action: 'SELECT_START',
        result: true,
      })
    }
    const locationArray = getLocationsInBox(multiState.locationStart, location)
    const ids = await firstValueFrom(this.blocksFacade.selectBlockIdsFromArray(locationArray))
    this.multiFacade.finishMultiSelect(location, ids)
    return new MouseEventReturn({
      action: 'SELECT_FINISH',
      result: true,
    })
  }

  async multiCreate(location: string, multiState: MultiState): Promise<MouseEventReturn> {
    const [createMode, project, selectedStringId] = await firstValueFrom(
      combineLatest([
        this.gridFacade.createMode$,
        this.projectsFacade.projectFromRoute$,
        this.selectedFacade.selectedStringId$,
      ]),
    )

    if (!multiState.locationStart) {
      this.multiFacade.startMultiCreate(location, createMode)
      return new MouseEventReturn({
        action: 'CREATE_START_PANEL',
        result: true,
      })
    }
    if (!project) {
      return new MouseEventReturn({
        action: 'UNDEFINED',
        result: false,
        error: 'multiCreate, !project',
      })
    }
    const locationArray = getLocationsInBox(multiState.locationStart, location)
    switch (createMode) {
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
        return new MouseEventReturn({
          action: 'CREATE_FINISH_PANEL',
          result: true,
        })
      }
      default:
        return new MouseEventReturn({
          action: 'UNDEFINED',
          result: false,
          error: 'multiCreate, default',
        })
    }
  }
}
