import { inject, Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Store } from '@ngrx/store'

import { firstValueFrom } from 'rxjs'

import { EntityCacheDispatcher } from '@ngrx/data'
import { BlocksService, MultiActions, selectMultiState } from '@grid-layout/data-access/store'
import { AppState } from '@shared/data-access/store'
import { getLocationsInBox } from '../helpers'

function getDifference<T>(a: T[], b: T[]): T[] {
  return a.filter((element) => {
    return !b.includes(element)
  })
}

@Injectable({
  providedIn: 'root',
})
export class MultiDeleteService {
  private store = inject(Store<AppState>)
  private blocksService = inject(BlocksService)


  async multiDelete(location: string) {
    const multiState = await firstValueFrom(this.store.select(selectMultiState))

    if (!multiState.locationStart) {
      this.store.dispatch(
        MultiActions.startMultiDelete({
          location,
        }),
      )
    } else {
      const blocksInBox = getLocationsInBox(multiState.locationStart!, location)
      console.log('blocksInBox', blocksInBox)
      if (blocksInBox) {
        await this.blocksService.deleteBlocksFromBox(blocksInBox)
        /*          this.blocksService.getBlocksFromIncludedArray(blocksInBox).then((blocks) => {
                    const ids = blocks.map((b) => b.id)
                    // this.panelsEntity.removeManyFromCache(ids)
                    blocks.forEach((block) => {
                      switch (block.model) {
                        case UnitModel.PANEL:
                          this.panelsEntity.delete(block.id)
                          break
                        case UnitModel.TRAY:
                          // this.t.delete(block.id)
                          break
                      }
                    })
                  })*/

        // const changes: ChangeSetItem[] = [cif.delete('Panel', blocksInBox)]
        // this.blocksService.deleteBlocksFromBox(blocksInBox)
      }
      this.store.dispatch(
        MultiActions.finishMultiDelete({
          location,
        }),
      )
    }
  }
}
