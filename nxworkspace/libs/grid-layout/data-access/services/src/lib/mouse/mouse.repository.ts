import { inject, Injectable } from '@angular/core'
import { GridEventFactory } from '@grid-layout/data-access/utils'
import {
  GridFacade,
  LinksFacade,
  MultiFacade,
  SelectedFacade
} from '@project-id/data-access/store'
import { ProjectsFacade } from '@projects/data-access/store'

import { GridEventResult } from '@grid-layout/data-access/actions'
import { match } from 'ts-pattern'

@Injectable({
  providedIn: 'root',
})
export class MouseRepository {
  private projectsFacade = inject(ProjectsFacade)
  private result = new GridEventFactory()
  private linksFacade = inject(LinksFacade)
  private selectedFacade = inject(SelectedFacade)
  private gridFacade = inject(GridFacade)
  private multiFacade = inject(MultiFacade)

  async updateState(result: GridEventResult): Promise<GridEventResult> {
    console.log(result)
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
