import { inject, Injectable } from '@angular/core'
import { Store } from '@ngrx/store'
import { PanelsFacade, SelectedFacade } from '@project-id/data-access/facades'
import { SelectedSelectors } from '@project-id/data-access/store'
import { ProjectsFacade } from '@projects/data-access/facades'
import { ProjectsSelectors } from '@projects/data-access/store'
import { PanelModel } from '@shared/data-access/models'
import { firstValueFrom } from 'rxjs'
import { GridEventFactory } from '../../grid.factory'
import { GridEventResult } from '@grid-layout/data-access/actions'

@Injectable({
  providedIn: 'root',
})
export class SelectedFactory {
  private readonly eventFactory = inject(GridEventFactory)
  private readonly store = inject(Store)
  private readonly projectsFacade = inject(ProjectsFacade)
  private readonly selectedFacade = inject(SelectedFacade)
  private readonly panelsFacade = inject(PanelsFacade)
  private readonly project$ = this.store.select(ProjectsSelectors.selectProjectByRouteParams)
  private readonly selectedStringId$ = this.store.select(SelectedSelectors.selectSelectedStringId)

  async clearState(): Promise<GridEventResult> {
    this.selectedFacade.clearSelected()
    return this.eventFactory.action({ action: 'CLEAR_SELECTED_STATE', data: { log: 'selectEmpty' } })
  }
}
