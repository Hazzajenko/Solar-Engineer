import { Injectable } from '@angular/core'
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects'
import { Store } from '@ngrx/store'
import { AppState } from '../../../../../store/app.state'
import { tap } from 'rxjs/operators'
import { BlocksStateActions } from '../../store/blocks/blocks.actions'
import { UnitModel } from '../../../../models/unit.model'
import { DataEntities } from '../data-actions'
import { EntityOp } from '@ngrx/data'
import { BlockModel } from '../../../../models/block.model'
import { RailModel } from '../../../../models/rail.model'
import { selectBlocksByProjectIdRouteParams } from '../../store/blocks/blocks.selectors'

@Injectable()
export class RailsEntityEffects {
  addRail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(`${DataEntities.Rail} ${EntityOp.SAVE_ADD_ONE_SUCCESS}`),
        concatLatestFrom((action) =>
          this.store.select(selectBlocksByProjectIdRouteParams),
        ),
        tap(([action, blocks]: [any, BlockModel[]]) => {
          const rail = action.payload.data
          const existing = blocks.find((b) => b.location === rail.location)
          if (!existing) {
            this.store.dispatch(
              BlocksStateActions.addBlockForGrid({
                block: {
                  id: rail.id,
                  location: rail.location,
                  model: UnitModel.RAIL,
                  project_id: rail.project_id!,
                },
              }),
            )
          } else {
            this.store.dispatch(
              BlocksStateActions.updateBlockForGrid({
                block: {
                  id: existing.id,
                  location: existing.location,
                  model: existing.model,
                  project_id: existing.project_id!,
                  inside_blocks: [
                    {
                      inside_id: rail.id,
                      inside_model: UnitModel.RAIL,
                    },
                  ],
                },
              }),
            )
          }
        }),
      ),
    { dispatch: false },
  )
  getAllRails$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(`${DataEntities.Rail} ${EntityOp.QUERY_ALL_SUCCESS}`),
        tap((action: any) => {
          const blocks: BlockModel[] = action.payload.data.map(
            (rail: RailModel) => {
              const block: BlockModel = {
                id: rail.id,
                location: rail.location,
                model: UnitModel.RAIL,
                project_id: rail.project_id!,
              }
              return block
            },
          )
          this.store.dispatch(
            BlocksStateActions.addManyBlocksForGrid({
              blocks,
            }),
          )
        }),
      ),
    { dispatch: false },
  )
  updateOneRail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(`${DataEntities.Rail} ${EntityOp.SAVE_UPDATE_ONE_SUCCESS}`),
        tap((action: any) => {
          const data = action.payload.data
          this.store.dispatch(
            BlocksStateActions.updateBlockForGrid({
              block: {
                id: data.id,
                location: data.changes.location,
                model: UnitModel.RAIL,
                project_id: data.changes.project_id!,
              },
            }),
          )
        }),
      ),
    { dispatch: false },
  )
  deleteRail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(`${DataEntities.Rail} ${EntityOp.SAVE_DELETE_ONE}`),
        tap((action: any) => {
          const data = action.payload.data
          this.store.dispatch(
            BlocksStateActions.deleteBlockForGrid({
              block_id: data,
            }),
          )
        }),
      ),
    { dispatch: false },
  )

  constructor(private actions$: Actions, private store: Store<AppState>) {}
}
