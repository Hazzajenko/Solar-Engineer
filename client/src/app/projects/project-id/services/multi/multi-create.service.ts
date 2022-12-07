import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Store } from '@ngrx/store'
import { AppState } from '../../../../store/app.state'
import { combineLatestWith, firstValueFrom } from 'rxjs'
import { PanelsEntityService } from '../ngrx-data/panels-entity/panels-entity.service'
import { MultiActions } from '../store/multi-create/multi.actions'
import { selectMultiState } from '../store/multi-create/multi.selectors'
import { selectBlocksByProjectIdRouteParams } from '../store/blocks/blocks.selectors'
import { BlockModel } from '../../../models/block.model'
import { PanelModel } from '../../../models/panel.model'
import { selectSelectedStringId } from '../store/selected/selected.selectors'
import { selectCreateMode } from '../store/grid/grid.selectors'
import { UnitModel } from '../../../models/unit.model'
import { MultiState } from '../store/multi-create/multi.reducer'
import { checkIfAnyBlocksInRoute } from './multi-create.helpers'
import { RailsEntityService } from '../ngrx-data/rails-entity/rails-entity.service'
import { RailModel } from '../../../models/rail.model'
import { selectCurrentProjectId } from '../store/projects/projects.selectors'
import { map } from 'rxjs/operators'
import { getLocationsInBox } from '../get-locations-in-box'
import { BlocksService } from '../store/blocks/blocks.service'
import { ItemsService } from '../items.service'

@Injectable({
  providedIn: 'root',
})
export class MultiCreateService {
  constructor(
    private http: HttpClient,
    private store: Store<AppState>,
    private panelsEntity: PanelsEntityService,
    private railsEntity: RailsEntityService,
    private blocksService: BlocksService,
    private itemsService: ItemsService,
  ) {}

  multiCreate(location: string) {
    firstValueFrom(
      this.store
        .select(selectCreateMode)
        .pipe(combineLatestWith(this.store.select(selectMultiState))),
    ).then(([createMode, multiCreateState]) => {
      switch (createMode) {
        case UnitModel.PANEL:
          this.multiCreatePanelV2(location, multiCreateState)
          break
        case UnitModel.RAIL:
          this.multiCreateRail(location, multiCreateState)
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

        this.itemsService.addManyItems(UnitModel.PANEL, locationsInBox)

        this.store.dispatch(
          MultiActions.finishMultiCreatePanel({
            location,
          }),
        )
      })
    }
  }
/*
  multiCreateCable(location: string, multiCreateState: MultiState) {
    if (!multiCreateState.locationStart) {
      this.store.dispatch(
        MultiActions.start({
          location,
        }),
      )
    } else {
      const locationsInBox = getLocationsInBox(multiCreateState.locationStart!, location)
      this.blocksService.getBlocksFromIncludedArray(locationsInBox).then((blocksInBox) => {
        if (blocksInBox.length > 0) {
          return console.error('there are blocks in path, ', blocksInBox)
        }

        this.itemsService.addManyItems(UnitModel.PANEL, locationsInBox)

        this.store.dispatch(
          MultiActions.finishMultiCreatePanel({
            location,
          }),
        )
      })
    }
  }*/
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
        // this.blocksService.getBlocksFromIncludedArray()
        const locationsInBox = getLocationsInBox(multiCreateState.locationStart!, location)
        const blocksInBox = this.blocksService.getBlocksFromIncludedArray(locationsInBox)
        console.log('locationsInBox', locationsInBox)
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

  multiCreateRail(location: string, multiCreateState: MultiState) {
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
        const blocksInRoute = checkIfAnyBlocksInRoute(
          multiCreateState.locationStart!,
          location,
          blocks,
        )
        console.log(blocksInRoute)
        if (blocksInRoute.existingBlocks) {
          blocksInRoute.existingBlocks.forEach((block) => {
            switch (block.model) {
              case UnitModel.PANEL:
                firstValueFrom(
                  this.panelsEntity.entities$.pipe(
                    map((panels) => panels.find((p) => p.id === block.id)),
                  ),
                ).then((panel) => {
                  if (!panel) return console.error(`multiCreateRail !panel`)
                  // const newRail = new RailModel(projectId, location, true)
                  const update: PanelModel = {
                    ...panel,
                    rotation: 0,
                  }
                  // this.railsEntity.add(newRail)
                  this.panelsEntity.update(update)
                })

                break
              default:
                break
            }
          })
          blocksInRoute.locationStrings?.forEach((location) => {
            const rail = new RailModel(projectId, location, false)
            this.railsEntity.add(rail)
          })
        } else {
          const rails = blocksInRoute.locationStrings?.map((location) => {
            return new RailModel(projectId, location, false)
          })
          if (rails) {
            this.railsEntity.addManyToCache(rails)
          }
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
