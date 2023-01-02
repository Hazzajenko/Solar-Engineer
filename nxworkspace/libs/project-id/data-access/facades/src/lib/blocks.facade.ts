import { inject, Injectable } from '@angular/core'
import { Update } from '@ngrx/entity'
import { Store } from '@ngrx/store'
import { BlockModel } from '@shared/data-access/models'
import { BlocksSelectors, BlocksActions } from '@project-id/data-access/store'
import { firstValueFrom, map } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class BlocksFacade {
  private readonly store = inject(Store)

  loaded$ = this.store.select(BlocksSelectors.selectBlocksLoaded)
  allBlocks$ = this.store.select(BlocksSelectors.selectAllBlocks)
  blocksFromRoute$ = this.store.select(BlocksSelectors.selectBlocksByProjectIdRouteParams)

  blockById(id: string) {
    return this.store.select(BlocksSelectors.selectBlockById({ id }))
  }

  blockByLocation$(location: string) {
    return this.store.select(BlocksSelectors.selectBlockByLocation({ location }))
  }

  blockByLocation(location: string) {
    return firstValueFrom(this.store.select(BlocksSelectors.selectBlockByLocation({ location })))
  }

  async anyBlocksInArray(locationArray: string[]) {
    return firstValueFrom(
      this.allBlocks$.pipe(
        map((blocks) => blocks.filter((block) => locationArray.includes(block.location))),
      ),
    )
  }

  selectBlocksFromArray(locationArray: string[]) {
    return this.store.select(BlocksSelectors.selectBlockIdsFromArray({ locationArray }))
  }

  selectBlockIdsFromArray$(locationArray: string[]) {
    return this.store.select(BlocksSelectors.selectBlockIdsFromArray({ locationArray }))
  }

  selectBlockIdsFromArray(locationArray: string[]) {
    return firstValueFrom(
      this.store.select(BlocksSelectors.selectBlockIdsFromArray({ locationArray })),
    )
  }

  updateBlock(update: Update<BlockModel>) {
    this.store.dispatch(BlocksActions.updateBlockForGrid({ update }))
  }

  updateBlockV2(update: Update<BlockModel>) {
    this.store.dispatch(BlocksActions.updateBlockForGrid({ update }))
  }
}
