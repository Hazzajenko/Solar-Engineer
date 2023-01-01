import { inject, Injectable } from '@angular/core'
import { GridEventResult } from '@grid-layout/data-access/actions'
import { Store } from '@ngrx/store'
import {
  BlocksFacade,
  GridFacade,
  MultiFacade,
  SelectedFacade
} from '@project-id/data-access/facades'
import { ProjectsFacade } from '@projects/data-access/facades'

import { BlockType } from '@shared/data-access/models'
import { GridEventFactory } from '../../grid.factory'
import { getLocationsInBox } from './get-locations-in-box'
import { locationArrayMap } from './location-array-map'

@Injectable({
  providedIn: 'root',
})
export class MultiFactory {
  private readonly eventFactory = inject(GridEventFactory)
  private readonly store = inject(Store)
  private readonly projectsFacade = inject(ProjectsFacade)
  private readonly selectedFacade = inject(SelectedFacade)
  private readonly multiFacade = inject(MultiFacade)
  private readonly blocksFacade = inject(BlocksFacade)
  private readonly gridFacade = inject(GridFacade)

  async createStart(location: string, type: BlockType) {
    this.multiFacade.startMultiCreate(location, type)
    return this.eventFactory.action({
      action: 'CREATE_START',
      data: { location, type },
    })
  }

  async createBlocks(
    type: BlockType,
    locationArray: string[],
    location: string,
  ): Promise<GridEventResult> {
    const project = await this.projectsFacade.projectFromRoute
    if (!project) {
      return this.eventFactory.fatal('project is not defined')
    }
    const selectedStringId = await this.selectedFacade.selectedStringId
    const blocks = locationArrayMap(type, locationArray, project.id, selectedStringId)
    if (!blocks) {
      return this.eventFactory.fatal('createBlocks unknown type')
    }

    this.multiFacade.finishMultiCreate(location, type, blocks)

    return this.eventFactory.action({
      action: 'CREATE_FINISH',
      data: { location, type: BlockType.PANEL, blocks },
    })
  }

  async select(locationStart: string | undefined, location: string): Promise<GridEventResult> {
    if (!locationStart) {
      this.multiFacade.startMultiSelect(location)
      return this.eventFactory.action({ action: 'SELECT_START', data: { location } })
    }
    const locationArray = getLocationsInBox(locationStart, location)
    const ids = await this.blocksFacade.selectBlockIdsFromArray(locationArray)

    this.multiFacade.finishMultiSelect(location, ids)
    return this.eventFactory.action({ action: 'SELECT_FINISH', data: { location, ids } })
  }
}
