import { inject, Injectable } from '@angular/core'
import {
  BlocksStoreService,
  getLocationsInBox,
  locationArrayMap,
  MultiStoreService,
  PanelsStoreService,
  SelectedStoreService,
} from '../'
import { ProjectsFacade } from '@projects/data-access'

import { BlockType } from '@shared/data-access/models'

@Injectable({
  providedIn: 'root',
})
export class MultiEventService {
  private readonly projectsFacade = inject(ProjectsFacade)
  private selectedStore = inject(SelectedStoreService)
  private multiStore = inject(MultiStoreService)
  private panelsStore = inject(PanelsStoreService)
  private blocksStore = inject(BlocksStoreService)

  async createStart(location: string, type: BlockType) {
    this.multiStore.dispatch.startMultiCreate(location, type)
    return
  }

  async createBlocks(type: BlockType, locationArray: string[], location: string) {
    const project = await this.projectsFacade.projectFromRoute
    if (!project) {
      return
    }
    const selectedStringId = await this.selectedStore.select.selectedStringId
    const blocks = locationArrayMap(type, locationArray, project.id, selectedStringId)
    if (!blocks) {
      return
    }

    this.multiStore.dispatch.finishMultiCreate(location, type, blocks)

    return
  }

  async multiSelect(locationStart: string | undefined, location: string) {
    if (!locationStart) {
      this.multiStore.dispatch.startMultiSelect(location)
      return
    }
    const locationArray = getLocationsInBox(locationStart, location)
    const ids = await this.blocksStore.select.selectBlockIdsFromArray(locationArray)

    this.multiStore.dispatch.finishMultiSelect(location, ids)
    return
  }

  async deleteMany(ids: string[]) {
    this.panelsStore.dispatch.deleteManyPanels(ids)
  }
}