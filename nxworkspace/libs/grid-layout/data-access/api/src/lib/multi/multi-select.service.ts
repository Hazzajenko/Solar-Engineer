import { inject, Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Store } from '@ngrx/store'

import { firstValueFrom } from 'rxjs'
import { AppState } from '@shared/data-access/store'
import { BlocksService, MultiActions, selectMultiState } from '@grid-layout/data-access/store'
import { getLocationsInBox } from '../helpers'


function getDifference<T>(a: T[], b: T[]): T[] {
  return a.filter((element) => {
    return !b.includes(element)
  })
}

@Injectable({
  providedIn: 'root',
})
export class MultiSelectService {
  private store = inject(Store<AppState>)
  private blocksService = inject(BlocksService)


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
