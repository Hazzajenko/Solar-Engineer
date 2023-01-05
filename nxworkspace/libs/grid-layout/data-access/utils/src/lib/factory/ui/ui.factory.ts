import { inject, Injectable } from '@angular/core'
import { Store } from '@ngrx/store'
import { GridFacade, PanelsFacade, SelectedFacade, StringsFacade } from '@project-id/data-access/facades'
import { LinksPathService } from '@project-id/utils'
import { ProjectsFacade } from '@projects/data-access/facades'
import { GridEventFactory } from '../../grid.factory'

@Injectable({
  providedIn: 'root',
})
export class UiFactory {
  private readonly eventFactory = inject(GridEventFactory)
  private readonly store = inject(Store)
  // private readonly eventFactory = inject(GridEvent)
  private readonly projectsFacade = inject(ProjectsFacade)
  private readonly gridFacade = inject(GridFacade)
  private readonly selectedFacade = inject(SelectedFacade)
  private readonly panelsFacade = inject(PanelsFacade)
  private readonly stringsFacade = inject(StringsFacade)
  private linksPathService = inject(LinksPathService)


}
