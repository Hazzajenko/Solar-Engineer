import { BlocksActions } from './blocks.actions';
import { inject, Injectable } from '@angular/core'
import { Update } from '@ngrx/entity'
import { Store } from '@ngrx/store'
import { BlockModel } from '@shared/data-access/models'
import * as BlocksSelectors from './blocks.selectors'

@Injectable({
  providedIn: 'root',
})
export class BlocksFacade {
  private readonly store = inject(Store)

  loaded$ = this.store.select(BlocksSelectors.selectBlocksLoaded)
  allBlocks$ = this.store.select(BlocksSelectors.selectAllBlocks)
  blocksFromRoute$ = this.store.select(BlocksSelectors.selectBlocksByProjectIdRouteParams)

  blockById(id: string) {
    return this.store.select(BlocksSelectors.selectBlockById({id}))
  }

  blockByLocation(location: string) {
    return this.store.select(BlocksSelectors.selectBlockByLocation({location}))
  }

  updateBlock(update: Update<BlockModel>) {
    this.store.dispatch(BlocksActions.updateBlockForGrid({update}))
  }

  updateBlockV2(update: Update<BlockModel>) {
    this.store.dispatch(BlocksActions.updateBlockForGrid({update}))
  }
}
