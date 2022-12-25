import { PanelModel } from '@shared/data-access/models'
import { inject, Injectable } from '@angular/core'
import { Store } from '@ngrx/store'

import { LinksActions } from './links.actions'
import * as LinksSelectors from './links.selectors'

@Injectable({
  providedIn: 'root',
})
export class LinksFacade {
  private readonly store = inject(Store)

  loaded$ = this.store.select(LinksSelectors.selectLinksLoaded)
  allLinks$ = this.store.select(LinksSelectors.selectAllLinks)
  linksFromRoute$ = this.store.select(LinksSelectors.selectLinksByRouteParams)

  init(projectId: number) {
    this.store.dispatch(LinksActions.initLinks({ projectId }))
  }

  linksByPanels(panels: PanelModel[]) {
    return this.store.select(LinksSelectors.selectLinksByPanels({ panels }))
  }
}
