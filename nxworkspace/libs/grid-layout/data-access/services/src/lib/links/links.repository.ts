import { GridEventResult } from './../../../../../../project-id/feature/grid-layout/src/lib/data-access/services/utils/grid.factory';
import { inject, Injectable } from '@angular/core'
import {
  BlocksFacade,
  GridFacade,
  LinksFacade,
  MultiFacade,
  PanelsFacade,
  SelectedFacade
} from '@project-id/data-access/store'
import { ProjectsFacade } from '@projects/data-access/store'


@Injectable({
  providedIn: 'root',
})
export class LinksRepository {
  private multiFacade = inject(MultiFacade)
  private gridFacade = inject(GridFacade)
  private blocksFacade = inject(BlocksFacade)
  private selectedFacade = inject(SelectedFacade)
  private panelsFacade = inject(PanelsFacade)
  private projectsFacade = inject(ProjectsFacade)
  private linksFacade = inject(LinksFacade)

  async updateState(result: GridEventResult) {
    /*     await match(result)
      .with({ payload: { action: 'ADD_LINK' } }, async ({ payload }) => {
        await this.linksFacade.createLink(payload.data.link),
          await this.selectedFacade.clearSelectedPanelLinks(),
          payload.data.shiftKey ? await this.linksFacade.clearLinkState() : null
      })
      .with({ payload: { action: 'START_LINK_PANEL' } }, async ({ payload }) =>
        this.linksFacade.startLinkPanel(payload.data.panelId),
      )
      .with({ payload: { action: 'CLEAR_GRID_STATE' } }, async ({ payload }) => {
        this.gridFacade.clearEntireGridState(), console.log(payload.data.log)
      })
      .with({ payload: { action: 'ERROR' } }, async ({ payload }) =>
        console.log(payload.data.error),
      )
      .with({ payload: { action: 'FATAL' } }, async ({ payload }) =>
        console.error(payload.data.fatal),
      )
      .otherwise(async () => console.error('unknown object to update state')) */
    return result
  }
}
