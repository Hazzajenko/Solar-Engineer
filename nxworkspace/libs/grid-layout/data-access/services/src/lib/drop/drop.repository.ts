import { inject, Injectable } from '@angular/core'
import { GridEventResult } from '@grid-layout/data-access/actions'
import { BlocksFacade, PanelsFacade } from '@project-id/data-access/store'
import { match } from 'ts-pattern'

@Injectable({
  providedIn: 'root',
})
export class DropRepository {
  private blocksFacade = inject(BlocksFacade)
  private panelsFacade = inject(PanelsFacade)

  async updateState(result: GridEventResult) {
    await match(result)
      .with({ payload: { action: 'UPDATE_PANEL' } }, async ({ payload }) =>
        this.panelsFacade.updatePanel(payload.data.update),
      )
      .with({ payload: { action: 'ERROR' } }, async ({ payload }) =>
        console.log(payload.data.error),
      )
      .with({ payload: { action: 'FATAL' } }, async ({ payload }) =>
        console.error(payload.data.fatal),
      )
      .otherwise(async () => console.error('DropRepository, unknown object to update state'))
    return result
  }
}
