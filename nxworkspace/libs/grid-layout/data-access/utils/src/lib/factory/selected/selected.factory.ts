import { inject, Injectable } from '@angular/core'
import { GridEventResult } from '@grid-layout/data-access/actions'
import { Store } from '@ngrx/store'
import { GridFacade, PanelsFacade, SelectedFacade, StringsFacade } from '@project-id/data-access/facades'
import { ProjectsFacade } from '@projects/data-access/facades'
import { GridMode } from '@shared/data-access/models'
import { GridEventFactory } from '../../grid.factory'

@Injectable({
  providedIn: 'root',
})
export class SelectedFactory {
  private readonly eventFactory = inject(GridEventFactory)
  private readonly store = inject(Store)
  private readonly projectsFacade = inject(ProjectsFacade)
  private readonly selectedFacade = inject(SelectedFacade)
  private readonly panelsFacade = inject(PanelsFacade)
  private readonly gridFacade = inject(GridFacade)
  private readonly stringsFacade = inject(StringsFacade)

  async selectString(stringId: string) {
    this.gridFacade.selectGridMode(GridMode.SELECT)
    const string = await this.stringsFacade.stringById(stringId)
    if (!string) return
    const panels = await this.panelsFacade.panelsByStringId(stringId)
    this.selectedFacade.selectString(string, panels)
  }

  async clearState(): Promise<GridEventResult> {
    this.selectedFacade.clearSelected()
    return this.eventFactory.action({ action: 'CLEAR_SELECTED_STATE', data: { log: 'selectEmpty' } })
  }
}
