import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Store } from '@ngrx/store'
import { AppState } from '../../../store/app.state'
import { combineLatestWith, firstValueFrom } from 'rxjs'
import { PanelsEntityService } from './ngrx-data/panels-entity/panels-entity.service'
import { MultiCreateActions } from './store/multi-create/multi-create.actions'
import { selectMultiCreateState } from './store/multi-create/multi-create.selectors'
import { selectBlocksByProjectIdRouteParams } from './store/blocks/blocks.selectors'
import { BlockModel } from '../../models/block.model'
import { PanelModel } from '../../models/panel.model'
import { selectSelectedStringId } from './store/selected/selected.selectors'
import { selectCreateMode } from './store/grid/grid.selectors'
import { UnitModel } from '../../models/unit.model'
import { MultiCreateState } from './store/multi-create/multi-create.reducer'
import { checkIfAnyBlocksInRoute } from './multi-create.helpers'
import { RailsEntityService } from './ngrx-data/rails-entity/rails-entity.service'
import { NumberLocation } from './strings.deconstruct'
import { RailModel } from '../../models/rail.model'
import { selectCurrentProjectId } from './store/projects/projects.selectors'
import { map } from 'rxjs/operators'

@Injectable({
  providedIn: 'root',
})
export class MultiCreateService {
  constructor(
    private http: HttpClient,
    private store: Store<AppState>,
    private panelsEntity: PanelsEntityService,
    private railsEntity: RailsEntityService,
  ) {}

  multiCreate(location: string) {
    firstValueFrom(
      this.store
        .select(selectCreateMode)
        .pipe(combineLatestWith(this.store.select(selectMultiCreateState))),
    ).then(([createMode, multiCreateState]) => {
      switch (createMode) {
        case UnitModel.PANEL:
          this.multiCreatePanel(location, multiCreateState)
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

  multiCreatePanel(location: string, multiCreateState: MultiCreateState) {
    if (!multiCreateState.locationStart) {
      this.store.dispatch(
        MultiCreateActions.startMultiCreatePanel({
          location,
        }),
      )
    } else {
      this.checkIfAnyBlocksInRoute(multiCreateState.locationStart, location)
      this.store.dispatch(
        MultiCreateActions.finishMultiCreatePanel({
          location,
        }),
      )
    }
  }

  multiCreateRail(location: string, multiCreateState: MultiCreateState) {
    if (!multiCreateState.locationStart) {
      this.store.dispatch(
        MultiCreateActions.startMultiCreateRail({
          location,
        }),
      )
    } else {
      // this.checkIfAnyBlocksInRoute(multiCreateState.locationStart, location)
      firstValueFrom(
        this.store
          .select(selectBlocksByProjectIdRouteParams)
          .pipe(combineLatestWith(this.store.select(selectCurrentProjectId))),
      ).then(([blocks, projectId]) => {
        const numberOneLocation = new NumberLocation(multiCreateState.locationStart!)
        const numberTwoLocation = new NumberLocation(location)
        // const blocksInPath = checkIfAnyBlocksInPath(numberOneLocation, numberTwoLocation, blocks)

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
                  const newRail = new RailModel(projectId, location, true)
                  const update: PanelModel = {
                    ...panel,
                    has_child_block: true,
                    child_block_model: UnitModel.RAIL,
                    child_block_id: newRail.id,
                  }
                  this.railsEntity.add(newRail)
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
          MultiCreateActions.finishMultiCreateRail({
            location,
          }),
        )
      })
    }
  }

  checkIfAnyBlocksInRoute(locationOne: string, locationTwo: string) {
    firstValueFrom(this.store.select(selectBlocksByProjectIdRouteParams)).then((blocks) => {
      let numberOneRow: number | undefined = undefined
      let numberOneCol: number | undefined = undefined

      const splitOne = locationOne.split('')
      splitOne.forEach((p, index) => {
        if (p === 'c') {
          const row = locationOne.slice(3, index)
          const col = locationOne.slice(index + 3, locationOne.length)
          numberOneRow = Number(row)
          numberOneCol = Number(col)
        }
      })
      let numberTwoRow: number | undefined = undefined
      let numberTwoCol: number | undefined = undefined
      const splitTwo = locationTwo.split('')
      splitTwo.forEach((p, index) => {
        if (p === 'c') {
          const row = locationTwo.slice(3, index)
          const col = locationTwo.slice(index + 3, locationTwo.length)
          numberTwoRow = Number(row)
          numberTwoCol = Number(col)
        }
      })
      if (numberOneCol && numberTwoCol && numberOneRow && numberTwoRow) {
        // console.log()
        if (numberOneCol === numberTwoCol) {
          if (numberOneRow < numberTwoRow) {
            // going up
            const upBlocks = numberTwoRow - numberOneRow
            // let blockStrings: string[] = []
            let blocksInRoute: BlockModel[] = []
            let blockLocations: string[] = []
            for (let i = 0; i < upBlocks; i++) {
              // blockStrings[i] = `row${numberOneRow +i+1}col${numberOneCol}`
              blockLocations[i] = `row${numberOneRow! + i + 1}col${numberOneCol}`
              if (blocks.find((b) => b.location === blockLocations[i])) {
                blocksInRoute[i] = blocks.find(
                  (b) => b.location === `row${numberOneRow! + i + 1}col${numberOneCol}`,
                )!
              }
            }
            if (blocksInRoute.length > 0) {
              for (let i = 0; i < blocksInRoute.length; i++) {
                console.error(`block exists in path at ${blocksInRoute[i]?.location}`)
              }
              return
            } else {
              firstValueFrom(this.store.select(selectSelectedStringId)).then((selectedStringId) => {
                if (selectedStringId) {
                  for (let i = 0; i < upBlocks; i++) {
                    const panel = new PanelModel(blockLocations[i], selectedStringId, false)
                    this.panelsEntity.add(panel)
                  }
                } else {
                  for (let i = 0; i < upBlocks; i++) {
                    const panel = new PanelModel(blockLocations[i], 'undefined', false)
                    this.panelsEntity.add(panel)
                  }
                }
              })
            }
          }
        }
      }
    })
  }
}
