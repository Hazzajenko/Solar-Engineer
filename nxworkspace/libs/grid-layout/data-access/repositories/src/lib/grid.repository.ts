import { inject, Injectable } from '@angular/core'
import {
  BlocksFacade,
  GridFacade,
  LinksFacade,
  MultiFacade,
  PanelsFacade,
  SelectedFacade,
} from '@project-id/data-access/facades'
import { match } from 'ts-pattern'
import { GridEventFactory } from '@grid-layout/data-access/utils'
import { GridEventResult } from '@grid-layout/data-access/actions'

@Injectable({
  providedIn: 'root',
})
export class GridRepository {
  private multiFacade = inject(MultiFacade)
  private _result = new GridEventFactory()
  private gridFacade = inject(GridFacade)
  private blocksFacade = inject(BlocksFacade)
  private selectedFacade = inject(SelectedFacade)
  private panelsFacade = inject(PanelsFacade)
  private linksFacade = inject(LinksFacade)

  /* async updateState(result: GridEventResult) {
    console.log('updateState', result)
    await match(result)
      // #regionP
      // Start Click Actions
      .with({ payload: { action: 'SELECT_PANEL' } }, async ({ payload }) =>
        this.selectedFacade.selectPanel(payload.data.panelId),
      )
      .with({ payload: { action: 'SELECT_PANEL_WHEN_STRING_SELECTED' } }, async ({ payload }) =>
        this.selectedFacade.selectPanelWhenStringSelected(payload.data.panelId),
      )
      .with({ payload: { action: 'ADD_PANEL_TO_MULTISELECT' } }, async ({ payload }) =>
        this.selectedFacade.addPanelToMultiSelect(payload.data.panelId),
      )
      .with({ payload: { action: 'CREATE_PANEL' } }, async ({ payload }) =>
        this.panelsFacade.createPanel(payload.data.panel),
      )
      .with({ payload: { action: 'DELETE_PANEL' } }, async ({ payload }) =>
        this.panelsFacade.deletePanel(payload.data.panelId),
      )
      .with({ payload: { action: 'SELECT_SELECT_MODE' } }, async ({ payload }) => {
        this.gridFacade.selectSelectMode()
        console.log(payload.data.log)
      })
      .with({ payload: { action: 'CLEAR_SELECTED_STATE' } }, async ({ payload }) => {
        this.selectedFacade.clearSelected()
        console.log(payload.data.log)
      })
      .with({ payload: { action: 'ADD_LINK' } }, async ({ payload }) => {
        await this.linksFacade.createLink(payload.data.link)
        await this.selectedFacade.clearSelectedPanelLinks()
        payload.data.shiftKey ? await this.linksFacade.clearLinkState() : null
      })
      .with({ payload: { action: 'START_LINK_PANEL' } }, async ({ payload }) =>
        this.linksFacade.startLinkPanel(payload.data.panelId),
      )
      .with({ payload: { action: 'CLEAR_GRID_STATE' } }, async ({ payload }) => {
        this.gridFacade.clearEntireGridState(), console.log(payload.data.log)
      })
      // Finish Click Actions
      // #endregion

      // #region
      // Start Drop Actions
      .with({ payload: { action: 'UPDATE_PANEL' } }, async ({ payload }) =>
        this.panelsFacade.updatePanel(payload.data.update),
      )
      // Finish Drop Actions
      // #endregion

      // #region
      // Start Mouse Actions
      .with({ payload: { action: 'SELECT_START' } }, async ({ payload }) =>
        this.multiFacade.startMultiSelect(payload.data.location),
      )
      .with({ payload: { action: 'SELECT_FINISH' } }, async ({ payload }) =>
        this.multiFacade.finishMultiSelect(payload.data.location, payload.data.ids),
      )
      .with({ payload: { action: 'CREATE_START_PANEL' } }, async ({ payload }) =>
        this.multiFacade.startMultiCreate(payload.data.location, payload.data.type),
      )
      .with({ payload: { action: 'CREATE_FINISH_PANEL' } }, async ({ payload }) =>
        this.multiFacade.finishMultiCreatePanels(
          payload.data.location,
          payload.data.type,
          payload.data.panels,
        ),
      )
      // Finish Mouse Actions
      // #endregion

      .with({ payload: { action: 'ERROR' } }, async ({ payload }) =>
        console.log(payload.data.error),
      )
      .with({ payload: { action: 'FATAL' } }, async ({ payload }) =>
        console.error(payload.data.fatal),
      )
      // .exhaustive();
      .otherwise(async () => console.error('unknown object to update state'))
    return result
  } */
}
