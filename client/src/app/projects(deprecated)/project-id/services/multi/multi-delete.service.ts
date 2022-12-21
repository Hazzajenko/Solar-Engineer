import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Store } from '@ngrx/store'
import { AppState } from '../../../../store/app.state'
import { firstValueFrom } from 'rxjs'
import { PanelsEntityService } from '../ngrx-data/panels-entity/panels-entity.service'
import { MultiActions } from '../store/multi-create/multi.actions'
import { selectMultiState } from '../store/multi-create/multi.selectors'
import { RailsEntityService } from '../ngrx-data/rails-entity/rails-entity.service'
import { getLocationsInBox } from '../get-locations-in-box'
import { BlocksService } from '../store/blocks/blocks.service'
import { EntityCacheDispatcher } from '@ngrx/data'

function getDifference<T>(a: T[], b: T[]): T[] {
  return a.filter((element) => {
    return !b.includes(element)
  })
}

@Injectable({
  providedIn: 'root',
})
export class MultiDeleteService {
  constructor(
    private http: HttpClient,
    private store: Store<AppState>,
    private panelsEntity: PanelsEntityService,
    private railsEntity: RailsEntityService,
    private blocksService: BlocksService,
    private cache: EntityCacheDispatcher,
  ) {}

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
