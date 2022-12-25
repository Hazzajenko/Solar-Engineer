import { inject, Injectable } from '@angular/core'
import { Store } from '@ngrx/store'

import * as BlocksSelectors from './blocks.selectors'

@Injectable({
  providedIn: 'root',
})
export class BlocksFacade {
  private readonly store = inject(Store)

  loaded$ = this.store.select(BlocksSelectors.selectBlocksLoaded)
  allBlocks$ = this.store.select(BlocksSelectors.selectAllBlocks)
}
