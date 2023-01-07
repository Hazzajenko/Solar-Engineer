import { inject, Injectable } from '@angular/core'
import { ClientXY } from '@grid-layout/shared/models'
import { GridStoreService, LinksStoreService } from '@project-id/data-access/facades'
import { GridMode } from '@shared/data-access/models'

@Injectable({
  providedIn: 'root',
})
export class GridFactory {

  private gridStore = inject(GridStoreService)
  private linksStore = inject(LinksStoreService)

  async select(gridMode: GridMode) {
    switch (gridMode) {
      case GridMode.CREATE: {
        this.gridStore.dispatch.selectGridMode(GridMode.CREATE)
        return
      }
      case GridMode.LINK: {
        this.gridStore.dispatch.selectGridMode(GridMode.LINK)
        return
      }
      case GridMode.SELECT: {

        this.linksStore.dispatch.clearLinkState()
        this.gridStore.dispatch.selectGridMode(GridMode.SELECT)
        return
      }
      case GridMode.DELETE: {
        this.gridStore.dispatch.selectGridMode(GridMode.DELETE)
        return
      }
      default:
        return
    }
  }

  async updateXY(clientXY: ClientXY) {
    this.gridStore.dispatch.updateClientXY(clientXY)
    return
  }

  async clearState(log: string) {
    this.gridStore.dispatch.clearEntireGridState()
    return
  }
}