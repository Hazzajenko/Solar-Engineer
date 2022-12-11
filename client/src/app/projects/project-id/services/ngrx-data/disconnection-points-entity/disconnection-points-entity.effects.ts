import { Injectable } from '@angular/core'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { Store } from '@ngrx/store'
import { AppState } from '../../../../../store/app.state'
import { DataEntities } from '../data-actions'
import { tap } from 'rxjs/operators'
import { EntityOp } from '@ngrx/data'
import { BlockModel } from '../../../../models/block.model'
import { TypeModel } from '../../../../models/type.model'
import { BlocksStateActions } from '../../store/blocks/blocks.actions'
import { DisconnectionPointModel } from '../../../../models/disconnection-point.model'

@Injectable()
export class DisconnectionPointsEntityEffects {
  addDisconnectionPoint$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(`${DataEntities.DisconnectionPoint} ${EntityOp.SAVE_ADD_ONE_SUCCESS}`),
        tap((action: any) => {
          const disconnectionPoint = action.payload.data
          this.store.dispatch(
            BlocksStateActions.addBlockForGrid({
              block: {
                id: disconnectionPoint.id,
                location: disconnectionPoint.location,
                type: TypeModel.DISCONNECTIONPOINT,
                projectId: disconnectionPoint.project_id!,
              },
            }),
          )
        }),
      ),
    { dispatch: false },
  )
  getAllDisconnectionPoints$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(`${DataEntities.DisconnectionPoint} ${EntityOp.QUERY_ALL_SUCCESS}`),
        tap((action: any) => {
          const blocks: BlockModel[] = action.payload.data.map(
            (disconnectionPoint: DisconnectionPointModel) => {
              const block: BlockModel = {
                id: disconnectionPoint.id,
                location: disconnectionPoint.location!,
                type: TypeModel.DISCONNECTIONPOINT,
                projectId: disconnectionPoint.projectId!,
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
  updateOneDisconnectionPoint$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(`${DataEntities.DisconnectionPoint} ${EntityOp.SAVE_UPDATE_ONE_SUCCESS}`),
        tap((action: any) => {
          console.log(action)
          const data = action.payload.data
          this.store.dispatch(
            BlocksStateActions.updateBlockForGrid({
              block: {
                id: data.id,
                location: data.changes.location,
                type: TypeModel.DISCONNECTIONPOINT,
                projectId: data.changes.project_id!,
              },
            }),
          )
        }),
      ),
    { dispatch: false },
  )
  deleteDisconnectionPoint$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(`${DataEntities.DisconnectionPoint} ${EntityOp.SAVE_DELETE_ONE}`),
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
