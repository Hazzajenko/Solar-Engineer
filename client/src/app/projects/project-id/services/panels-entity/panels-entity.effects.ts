import { Injectable } from '@angular/core'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { Store } from '@ngrx/store'
import { AppState } from '../../../../store/app.state'
import { PanelsService } from '../../../services/panels.service'
import { PanelsEntityService } from './panels-entity.service'
import { tap } from 'rxjs/operators'
import { BlocksStateActions } from '../../../store/blocks/blocks.actions'
import { UnitModel } from '../../../models/unit.model'
import { DataEntities } from '../data-actions'
import { EntityOp } from '@ngrx/data'
import { BlockModel } from '../../../models/block.model'
import { PanelModel } from '../../../models/panel.model'

@Injectable()
export class PanelsEntityEffects {
  addPanel$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(`${DataEntities.Panel} ${EntityOp.SAVE_ADD_ONE_SUCCESS}`),
        tap((action: any) => {
          const panel = action.payload.data
          this.store.dispatch(
            BlocksStateActions.addBlockForGrid({
              block: {
                id: panel.id,
                location: panel.location,
                model: UnitModel.PANEL,
                type: 'PANEL',
                project_id: panel.project_id!,
                color: panel.color,
              },
            }),
          )
        }),
      ),
    { dispatch: false },
  )
  getAllPanels$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(`${DataEntities.Panel} ${EntityOp.QUERY_ALL_SUCCESS}`),
        tap((action: any) => {
          const blocks: BlockModel[] = action.payload.data.map(
            (panel: PanelModel) => {
              const block: BlockModel = {
                id: panel.id,
                location: panel.location,
                model: UnitModel.PANEL,
                type: 'PANEL',
                project_id: panel.project_id!,
                color: panel.color,
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
  updateOnePanel$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(`${DataEntities.Panel} ${EntityOp.SAVE_UPDATE_ONE_SUCCESS}`),
        tap((action: any) => {
          const data = action.payload.data
          this.store.dispatch(
            BlocksStateActions.updateBlockForGrid({
              block: {
                id: data.id,
                location: data.changes.location,
                model: UnitModel.PANEL,
                type: 'PANEL',
                project_id: data.changes.project_id!,
              },
            }),
          )
        }),
      ),
    { dispatch: false },
  )
  deletePanel$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(`${DataEntities.Panel} ${EntityOp.SAVE_DELETE_ONE}`),
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

  /*  updatePanel$ = createEffect(
      () =>
        this.actions$.pipe(
          ofType(PanelStateActions.updatePanelHttp),
          exhaustMap((action) =>
            this.panelsService.updatePanel(action.request).pipe(
              map(
                (res) => {
                  console.log(res)
                  this.store.dispatch(
                    PanelStateActions.updatePanelToState({
                      panel: res.panel,
                    }),
                  )
                  this.store.dispatch(
                    BlocksStateActions.updateBlockForGrid({
                      oldLocation: action.request.panel.location,
                      block: {
                        id: res.panel.location,
                        model: UnitModel.PANEL,
                        type: 'PANEL',
                        project_id: res.panel.project_id!,
                      },
                    }),
                  )
                  console.log(res)
                },
                // catchError(async (err) => console.log(err)),
              ),
              catchError(async (error) => console.log(error)),
            ),
          ),
        ),
      { dispatch: false },
    )*/

  constructor(
    private actions$: Actions,
    private panelsService: PanelsService,
    private panelsEntity: PanelsEntityService,
    private store: Store<AppState>,
  ) {}
}
