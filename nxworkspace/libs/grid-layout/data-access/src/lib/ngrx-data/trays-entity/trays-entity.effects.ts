import { Injectable } from '@angular/core'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { Store } from '@ngrx/store'
import { AppState } from '@shared/data-access/store'
import { tap } from 'rxjs/operators'
import { BlocksStateActions } from '../../store/blocks/blocks.actions'
import { TypeModel } from '@shared/data-access/models'
import { DataEntities } from '../data-actions'
import { EntityOp } from '@ngrx/data'
import { BlockModel } from '@shared/data-access/models'
import { TrayModel } from '@shared/data-access/models'

@Injectable()
export class TraysEntityEffects {
  addTray$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(`${DataEntities.Tray} ${EntityOp.SAVE_ADD_ONE_SUCCESS}`),
        tap((action: any) => {
          const tray = action.payload.data
          this.store.dispatch(
            BlocksStateActions.addBlockForGrid({
              block: {
                id: tray.id,
                location: tray.location,
                type: TypeModel.TRAY,
                projectId: tray.project_id!,
              },
            }),
          )
        }),
      ),
    { dispatch: false },
  )
  getAllTrays$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(`${DataEntities.Tray} ${EntityOp.QUERY_ALL_SUCCESS}`),
        tap((action: any) => {
          const blocks: BlockModel[] = action.payload.data.map((tray: TrayModel) => {
            const block: BlockModel = {
              id: tray.id,
              location: tray.location,
              type: TypeModel.TRAY,
              projectId: tray.projectId!,
            }
            return block
          })
          this.store.dispatch(
            BlocksStateActions.addManyBlocksForGrid({
              blocks,
            }),
          )
        }),
      ),
    { dispatch: false },
  )
  updateOneTray$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(`${DataEntities.Tray} ${EntityOp.SAVE_UPDATE_ONE_SUCCESS}`),
        tap((action: any) => {
          const data = action.payload.data
          this.store.dispatch(
            BlocksStateActions.updateBlockForGrid({
              block: {
                id: data.id,
                location: data.changes.location,
                type: TypeModel.TRAY,
                projectId: data.changes.project_id!,
              },
            }),
          )
        }),
      ),
    { dispatch: false },
  )
  deleteTray$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(`${DataEntities.Tray} ${EntityOp.SAVE_DELETE_ONE}`),
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
