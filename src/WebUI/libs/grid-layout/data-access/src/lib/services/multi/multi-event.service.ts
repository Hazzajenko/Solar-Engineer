import { inject, Injectable } from '@angular/core'
import { BlocksStoreService, getLocationsInBox, GridPanelsStoreService, GridSelectedStoreService, locationArrayMap, MultiStoreService } from '../'
import { ProjectsFacade } from '@projects/data-access'

import { BlockType } from '@shared/data-access/models'
import { AuthStoreService } from '@auth/data-access'
import { throwExpression } from '@shared/utils'

@Injectable({
  providedIn: 'root',
})
export class MultiEventService {
  private readonly projectsFacade = inject(ProjectsFacade)
  private selectedStore = inject(GridSelectedStoreService)
  private multiStore = inject(MultiStoreService)
  private panelsStore = inject(GridPanelsStoreService)
  private blocksStore = inject(BlocksStoreService)
  private authStore = inject(AuthStoreService)

  async createStart(location: string, type: BlockType) {
    this.multiStore.dispatch.startMultiCreate(location, type)
    return
  }

  async createBlocks(type: BlockType, locationArray: string[], location: string) {
    // const project = await this.projectsFacade.projectFromRoute
    const project = await this.projectsFacade.selectedProject()
    /*    if (!project) {
     return
     }*/
    const userId = (await this.authStore.select.userId) ?? throwExpression('User not logged in')

    const selectedStringId = await this.selectedStore.select.selectedStringId
    const blocks = locationArrayMap(type, locationArray, project.id, selectedStringId, userId)
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
