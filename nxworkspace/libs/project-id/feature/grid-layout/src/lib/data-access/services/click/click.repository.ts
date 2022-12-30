import { inject, Injectable } from '@angular/core'
import {
  BlocksFacade,
  GridFacade,
  MultiFacade,
  PanelsFacade,
  SelectedFacade,
} from '@project-id/data-access/store'
import { ProjectsFacade } from '@projects/data-access/store'
import { match } from 'ts-pattern'
import { GridEventFactory, GridEventResult } from '../utils/grid.factory'

@Injectable({
  providedIn: 'root',
})
export class ClickRepository {
  private multiFacade = inject(MultiFacade)
  private result = new GridEventFactory().clickEvents()
  private gridFacade = inject(GridFacade)
  private blocksFacade = inject(BlocksFacade)
  private selectedFacade = inject(SelectedFacade)
  private panelsFacade = inject(PanelsFacade)
  private projectsFacade = inject(ProjectsFacade)

  async updateState(result: GridEventResult) {
    console.log('updateState', result)
    await match(result)
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
        this.gridFacade.selectSelectMode(), console.log(payload.data.log)
      })
      .with({ payload: { action: 'CLEAR_SELECTED_STATE' } }, async ({ payload }) => {
        this.selectedFacade.clearSelected(), console.log(payload.data.log)
      })

      .with({ payload: { action: 'ERROR' } }, async ({ payload }) =>
        console.log(payload.data.error),
      )
      .with({ payload: { action: 'FATAL' } }, async ({ payload }) =>
        console.error(payload.data.fatal),
      )
      .otherwise(async () => console.error('unknown object to update state'))
    return result
  }
}
