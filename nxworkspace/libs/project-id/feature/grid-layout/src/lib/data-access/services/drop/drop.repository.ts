import { inject, Injectable } from '@angular/core'
import { BlocksFacade, PanelsFacade } from '@project-id/data-access/store'
import { match } from 'ts-pattern'
import { GridEventFactory } from '../utils/grid.factory'
import { DropEventResult } from './drop.factory'

@Injectable({
  providedIn: 'root',
})
export class DropRepository {
  private result = new GridEventFactory().dropEvents()
  private blocksFacade = inject(BlocksFacade)
  private panelsFacade = inject(PanelsFacade)

  async updateState(result: DropEventResult) {
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
