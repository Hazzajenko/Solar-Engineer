import { inject, Injectable } from '@angular/core'
import {
  BlocksFacade,
  GridFacade,
  MultiFacade,
  MultiState,
  SelectedFacade,
} from '@project-id/data-access/store'
import { ProjectsFacade } from '@projects/data-access/store'
import { BlockType, PanelModel } from '@shared/data-access/models'
import { combineLatest, of } from 'rxjs'
import { map, switchMap } from 'rxjs/operators'
import { createMultiCreateEvent, MultiEventType, sendMultiEvent } from './multi.event'
import { getLocationsInBox } from './multi.utils'

@Injectable({
  providedIn: 'root',
})
export class MultiService {
  private projectsFacade = inject(ProjectsFacade)
  private blocksFacade = inject(BlocksFacade)
  private selectedFacade = inject(SelectedFacade)
  private gridFacade = inject(GridFacade)
  private multiFacade = inject(MultiFacade)

  multiSelect(location: string, multiState: MultiState) {
    return combineLatest([of(location), of(multiState)]).pipe(
      switchMap(([location, multiState]) => {
        if (!multiState.locationStart) {
          const event = sendMultiEvent(MultiEventType.SelectStart, { location })
          return of(event)
        }
        const locationArray = getLocationsInBox(multiState.locationStart, location)
        const res = this.blocksFacade
          .selectBlockIdsFromArray(locationArray)
          .pipe(map((ids) => sendMultiEvent(MultiEventType.SelectFinish, { location, ids })))
        return res
      }),
    )
  }

  multiCreate(location: string, multiState: MultiState) {
    return combineLatest([of(location), of(multiState), this.gridFacade.createMode$]).pipe(
      switchMap(([location, multiState, createMode]) => {
        if (!multiState.locationStart) {
          const event = createMultiCreateEvent({ type: createMode, location })
          return of(event)
        }
        return this.createBlockArray(createMode, location, multiState)
      }),
    )
  }

  private createBlockArray(type: BlockType, location: string, multiState: MultiState) {
    if (!multiState.locationStart) return of(undefined)
    const locationArray = getLocationsInBox(multiState.locationStart, location)
    return combineLatest([
      of(type),
      of(locationArray),
      this.projectsFacade.projectFromRoute$,
      this.selectedFacade.selectedStringId$,
    ]).pipe(
      map(([type, locationArray, project, selectedStringId]) => {
        if (!project) return undefined
        switch (type) {
          case BlockType.PANEL: {
            const panels = locationArray.map((location) => {
              return new PanelModel({
                projectId: project?.id,
                location,
                stringId: selectedStringId ? selectedStringId : 'undefined',
                rotation: 0,
                type: BlockType.PANEL,
              })
            })
            const event = sendMultiEvent(MultiEventType.CreateFinishPanel, { location, panels })
            return event
          }
          default:
            return undefined
        }
      }),
    )
  }
}
