import { inject, Injectable } from '@angular/core'
import { select, Store } from '@ngrx/store'

import { LinksActions } from './links.actions'
import * as LinksSelectors from './links.selectors'

@Injectable()
export class LinksFacade {
  private readonly store = inject(Store)

  loaded$ = this.store.pipe(select(LinksSelectors.selectLinksLoaded))
  allLinks$ = this.store.pipe(select(LinksSelectors.selectAllLinks))

  init(projectId: number) {
    this.store.dispatch(LinksActions.initLinks({ projectId }))
  }
}
