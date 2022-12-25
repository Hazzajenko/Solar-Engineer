import { Injectable, inject } from '@angular/core'
import { select, Store, Action } from '@ngrx/store'

import * as BlocksActions from './blocks.actions'
import * as BlocksFeature from './blocks.reducer'
import * as BlocksSelectors from './blocks.selectors'

@Injectable()
export class BlocksFacade {
  private readonly store = inject(Store)

  /**
   * Combine pieces of state using createSelector,
   * and expose them as observables through the facade.
   */
  loaded$ = this.store.pipe(select(BlocksSelectors.selectBlocksLoaded))
  allBlocks$ = this.store.pipe(select(BlocksSelectors.selectAllBlocks))
  selectedBlocks$ = this.store.pipe(select(BlocksSelectors.selectEntity))

  /**
   * Use the initialization action to perform one
   * or more tasks in your Effects.
   */
  init() {
    this.store.dispatch(BlocksActions.initBlocks())
  }
}
