import { inject, Injectable } from '@angular/core'
import {
  BlocksFacade,
  GridFacade,
  MultiFacade,
  SelectedFacade,
} from '@project-id/data-access/store'
import { ProjectsFacade } from '@projects/data-access/store'
import { GridEventFactory, GridEventResult } from '../utils/grid.factory'
import { MouseEventResult } from './mouse.factory'

import { match } from 'ts-pattern'

@Injectable({
  providedIn: 'root',
})
export class MouseRepository {
  private projectsFacade = inject(ProjectsFacade)
  private result = new GridEventFactory().mouseEvents()
  private blocksFacade = inject(BlocksFacade)
  private selectedFacade = inject(SelectedFacade)
  private gridFacade = inject(GridFacade)
  private multiFacade = inject(MultiFacade)

  async updateState(result: GridEventResult): Promise<GridEventResult> {
    await match(result)
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
