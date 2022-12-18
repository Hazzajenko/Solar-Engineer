import { inject, Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Store } from '@ngrx/store'

import { combineLatestWith, firstValueFrom } from 'rxjs'

import { checkIfAnyBlocksInRoute } from './multi-create.helpers'

import { map } from 'rxjs/operators'
import { getLocationsInBox } from '@grid-layout/data-access/api'
import {
  MultiActions, MultiState, PanelsEntityService, selectBlocksByProjectIdRouteParams,
  selectCreateMode,
  selectCurrentProjectId,
  selectMultiState, selectSelectedStringId,
} from '@grid-layout/data-access/store'
import { BlockModel, PanelModel, TypeModel } from '@shared/data-access/models'
import { AppState } from '@shared/data-access/store'


@Injectable({
  providedIn: 'root',
})
export class MultiService {
  private store = inject(Store<AppState>)
  private panelsEntity = inject(PanelsEntityService)


  multiSwitch(location: string) {
    firstValueFrom(
      this.store
        .select(selectCreateMode)
        .pipe(combineLatestWith(this.store.select(selectMultiState))),
    ).then(([createMode, multiCreateState]) => {
      switch (createMode) {
        case TypeModel.PANEL:
          this.multiCreatePanel(location, multiCreateState)
          break
        default:
          console.error(`${createMode} is not supported yet`)
          break
      }
    })
  }

  multiCreatePanel(location: string, multiCreateState: MultiState) {
    if (!multiCreateState.locationStart) {
      this.store.dispatch(
        MultiActions.startMultiCreateRail({
          location,
        }),
      )
    } else {
      firstValueFrom(
        this.store
          .select(selectBlocksByProjectIdRouteParams)
          .pipe(combineLatestWith(this.store.select(selectCurrentProjectId))),
      ).then(([blocks, projectId]) => {
        const blocksInBox = getLocationsInBox(multiCreateState.locationStart!, location)
        console.log('blocksInBox', blocksInBox)
        const blocksInRoute = checkIfAnyBlocksInRoute(
          multiCreateState.locationStart!,
          location,
          blocks,
        )
        console.log(blocksInRoute)
        if (blocksInRoute.existingBlocks) {
          console.info('these blocks are free, ', blocksInRoute.locationStrings)
          return console.error('there are blocks in path, ', blocksInRoute.existingBlocks)
        } else {
          firstValueFrom(this.store.select(selectSelectedStringId)).then((stringId) => {
            blocksInRoute.locationStrings?.forEach((location) => {
              const panel = new PanelModel(
                projectId,
                location,
                stringId ? stringId : 'undefined',
                0,
              )
              this.panelsEntity.add(panel)
            })
          })
        }
        this.store.dispatch(
          MultiActions.finishMultiCreateRail({
            location,
          }),
        )
      })
    }
  }
}
