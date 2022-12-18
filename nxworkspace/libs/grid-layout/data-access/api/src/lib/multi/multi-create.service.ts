import { inject, Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Store } from '@ngrx/store'

import { combineLatestWith, firstValueFrom } from 'rxjs'

import { getLocationsInBox } from '../helpers'

import { ItemsService } from '../items'
import { AppState } from '@shared/data-access/store'
import { PanelModel, TypeModel } from '@shared/data-access/models'
import {
  BlocksService,
  MultiActions, MultiState, PanelsEntityService,
  selectBlocksByProjectIdRouteParams,
  selectCreateMode, selectCurrentProjectId,
  selectMultiState,
} from '@grid-layout/data-access/store'


@Injectable({
  providedIn: 'root',
})
export class MultiCreateService {
  private store = inject(Store<AppState>)
  private panelsEntity = inject(PanelsEntityService)
  private blocksService = inject(BlocksService)
  private itemsService = inject(ItemsService)


  multiCreate(location: string) {
    firstValueFrom(
      this.store
        .select(selectCreateMode)
        .pipe(combineLatestWith(this.store.select(selectMultiState))),
    ).then(([createMode, multiCreateState]) => {
      switch (createMode) {
        case TypeModel.PANEL:
          this.multiCreatePanelV2(location, multiCreateState)
          break
        default:
          console.error(`${createMode} is not supported yet`)
          break
      }
    })
  }

  multiCreatePanelV2(location: string, multiCreateState: MultiState) {
    if (!multiCreateState.locationStart) {
      this.store.dispatch(
        MultiActions.startMultiCreateRail({
          location,
        }),
      )
    } else {
      const locationsInBox = getLocationsInBox(multiCreateState.locationStart!, location)
      this.blocksService.getBlocksFromIncludedArray(locationsInBox).then((blocksInBox) => {
        if (blocksInBox.length > 0) {
          return console.error('there are blocks in path, ', blocksInBox)
        }

        this.itemsService.addManyItems(TypeModel.PANEL, locationsInBox)

        this.store.dispatch(
          MultiActions.finishMultiCreatePanel({
            location,
          }),
        )
      })
    }
  }
}
