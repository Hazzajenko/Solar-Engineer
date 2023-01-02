import { inject, Injectable } from '@angular/core'
import { GridEventResult } from '@grid-layout/data-access/actions'
import { ClientXY } from '@grid-layout/shared/models'
import { GridFacade, LinksFacade, SelectedFacade } from '@project-id/data-access/facades'
import { ProjectsFacade } from '@projects/data-access/facades'
import { GridMode } from '@shared/data-access/models'
import { GridEventFactory } from '../../grid.factory'

@Injectable({
  providedIn: 'root',
})
export class GridFactory {
  private eventFactory = inject(GridEventFactory)
  private projectsFacade = inject(ProjectsFacade)
  private selectedFacade = inject(SelectedFacade)
  private linksFacade = inject(LinksFacade)
  private gridFacade = inject(GridFacade)

  async select(gridMode: GridMode): Promise<GridEventResult> {
    switch (gridMode) {
      case GridMode.CREATE: {
        this.gridFacade.selectGridMode(GridMode.CREATE)
        return this.eventFactory.action({
          action: 'SELECT_CREATE_MODE',
          data: { log: 'GridFactory, gridModeCreate' },
        })
      }
      case GridMode.LINK: {
        this.gridFacade.selectGridMode(GridMode.LINK)
        return this.eventFactory.action({
          action: 'SELECT_SELECT_MODE',
          data: { log: 'GridFactory, gridModeLink' },
        })
      }
      case GridMode.SELECT: {

        this.linksFacade.clearLinkState()
        this.gridFacade.selectGridMode(GridMode.SELECT)
        return this.eventFactory.action({
          action: 'SELECT_SELECT_MODE',
          data: { log: 'GridFactory, gridModeSelect' },
        })
      }
      case GridMode.DELETE: {
        this.gridFacade.selectGridMode(GridMode.DELETE)
        return this.eventFactory.action({
          action: 'SELECT_DELETE_MODE',
          data: { log: 'GridFactory, gridModeDelete' },
        })
      }
      default:
        return this.eventFactory.error('select gridModeSwitch, default')
    }
  }

  async updateXY(clientXY: ClientXY): Promise<GridEventResult> {
    this.gridFacade.updateClientXY(clientXY)
    return this.eventFactory.action({
      action: 'SELECT_DELETE_MODE',
      data: { log: 'GridFactory, gridModeDelete' },
    })
  }

  async clearState(log: string) {
    this.gridFacade.clearEntireGridState()
    return this.eventFactory.action({
      action: 'CLEAR_GRID_STATE',
      data: { log },
    })
  }
}
