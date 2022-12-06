import { Injectable } from '@angular/core'
import { Store } from '@ngrx/store'
import { AppState } from '../../../../../store/app.state'
import { firstValueFrom, Observable } from 'rxjs'
import { BlockModel } from '../../../../models/block.model'
import { selectBlocksByProjectIdRouteParams } from './blocks.selectors'
import { map } from 'rxjs/operators'
import { BlocksStateActions } from './blocks.actions'
import { SelectedStateActions } from '../selected/selected.actions'

@Injectable({
  providedIn: 'root',
})
export class BlocksService {
  private blocks$: Observable<BlockModel[]>

  // private blocks$: Observable<BlockModel[]>

  constructor(private store: Store<AppState>) {
    this.blocks$ = this.store.select(selectBlocksByProjectIdRouteParams)
  }

  public getBlocks() {
    /*    if (!this.blocks$) {
          this.blocks$ = this.store
            .select(selectBlocksByProjectIdRouteParams)
            .pipe(shareReplay({ bufferSize: 1, refCount: true })) as Observable<BlockModel[]>
        }

        return this.blocks$*/
  }

  getBlocksFromIncludedArray(blocksInBox: string[]) {
    return firstValueFrom(
      this.blocks$.pipe(
        map((blocks) => blocks.filter((block) => blocksInBox.includes(block.location!))),
      ),
    )
  }

  selectBlocksFromBox(blocksInBox: string[]) {
    this.getBlocksFromIncludedArray(blocksInBox).then((blocksToSelect) => {
      const multiIds = blocksToSelect.map((b) => b.id)
      this.store.dispatch(SelectedStateActions.selectMultiIds({ ids: multiIds }))
    })
  }

  deleteBlocksFromBox(blocksInBox: string[]) {
    this.getBlocksFromIncludedArray(blocksInBox).then((blocksToDelete) => {
      this.store.dispatch(BlocksStateActions.deleteManyBlocksForGrid({ blocks: blocksToDelete }))
    })
  }
}
