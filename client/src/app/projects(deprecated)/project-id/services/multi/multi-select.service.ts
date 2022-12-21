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

function getDifference<T>(a: T[], b: T[]): T[] {
  return a.filter((element) => {
    return !b.includes(element)
  })
}

@Injectable({
  providedIn: 'root',
})
export class MultiSelectService {
  constructor(
    private http: HttpClient,
    private store: Store<AppState>,
    private panelsEntity: PanelsEntityService,
    private railsEntity: RailsEntityService,
    private blocksService: BlocksService,
  ) {}

  multiSelect(location: string) {
    firstValueFrom(this.store.select(selectMultiState)).then((multiState) => {
      if (!multiState.locationStart) {
        this.store.dispatch(
          MultiActions.startMultiSelect({
            location,
          }),
        )
      } else {
        const blocksInBox = getLocationsInBox(multiState.locationStart!, location)
        console.log('blocksInBox', blocksInBox)
        if (blocksInBox) {
          this.blocksService.selectBlocksFromBox(blocksInBox)
        }
        this.store.dispatch(
          MultiActions.finishMultiSelect({
            location,
          }),
        )
      }
    })
  }
}
