import { Injectable } from '@angular/core'
import { Store } from '@ngrx/store'
import { AppState } from '../../../../../store/app.state'
import { firstValueFrom, Observable } from 'rxjs'
import { BlockModel } from '../../../../../../../../../libs/shared/data-access/models/src/lib/block.model'
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

  getBlockByLocation(location: string) {
    return firstValueFrom(
      this.blocks$.pipe(map((blocks) => blocks.find((block) => block.location === location))),
    )
  }

  getBlockByLocationAsync(location: string) {
    return this.blocks$.pipe(map((blocks) => blocks.find((block) => block.location === location)))
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

  async deleteBlocksFromBox(blocksInBox: string[]) {
    const blocksToDelete = await this.getBlocksFromIncludedArray(blocksInBox)
    const blockIds = blocksToDelete.map((x) => x.id)
    this.store.dispatch(BlocksStateActions.deleteManyBlocksForGrid({ blockIds }))
  }
}
