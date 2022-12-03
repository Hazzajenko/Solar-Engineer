import { Injectable } from '@angular/core'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { Store } from '@ngrx/store'
import { AppState } from '../../../../../store/app.state'
import { PanelsService } from '../../../../services/panels.service'
import { InvertersEntityService } from './inverters-entity.service'
import { DataEntities } from '../data-actions'
import { EntityOp } from '@ngrx/data'
import { tap } from 'rxjs/operators'
import { BlocksStateActions } from '../../store/blocks/blocks.actions'
import { UnitModel } from '../../../../models/unit.model'
import { BlockModel } from '../../../../models/block.model'
import { InverterModel } from '../../../../models/inverter.model'

@Injectable()
export class InvertersEntityEffects {
  addInverter$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(`${DataEntities.Inverter} ${EntityOp.SAVE_ADD_ONE_SUCCESS}`),
        tap((action: any) => {
          const inverter = action.payload.data
          this.store.dispatch(
            BlocksStateActions.addBlockForGrid({
              block: {
                id: inverter.id,
                location: inverter.location,
                model: UnitModel.INVERTER,
                project_id: inverter.project_id!,
              },
            }),
          )
        }),
      ),
    { dispatch: false },
  )
  getAllInverters$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(`${DataEntities.Inverter} ${EntityOp.QUERY_ALL_SUCCESS}`),
        tap((action: any) => {
          const blocks: BlockModel[] = action.payload.data.map(
            (inverter: InverterModel) => {
              const block: BlockModel = {
                id: inverter.id,
                location: inverter.location!,
                model: UnitModel.INVERTER,
                project_id: inverter.project_id!,
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
  updateOneInverter$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(`${DataEntities.Inverter} ${EntityOp.SAVE_UPDATE_ONE_SUCCESS}`),
        tap((action: any) => {
          const update = action.payload.data
          this.store.dispatch(
            BlocksStateActions.updateBlockForGrid({
              block: {
                id: update.id,
                location: update.changes.location,
                model: UnitModel.INVERTER,
                project_id: update.changes.project_id!,
              },
            }),
          )
        }),
      ),
    { dispatch: false },
  )
  deleteInverter$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(`${DataEntities.Inverter} ${EntityOp.SAVE_DELETE_ONE}`),
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

  constructor(
    private actions$: Actions,
    private panelsService: PanelsService,
    private panelsEntity: InvertersEntityService,
    private store: Store<AppState>,
  ) {}
}
