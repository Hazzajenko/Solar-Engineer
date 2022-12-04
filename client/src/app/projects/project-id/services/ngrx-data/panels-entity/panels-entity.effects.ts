import { Injectable } from '@angular/core'
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects'
import { Store } from '@ngrx/store'
import { AppState } from '../../../../../store/app.state'
import { PanelsService } from '../../../../services/panels.service'
import { PanelsEntityService } from './panels-entity.service'
import { tap } from 'rxjs/operators'
import { BlocksStateActions } from '../../store/blocks/blocks.actions'
import { UnitModel } from '../../../../models/unit.model'
import { DataEntities } from '../data-actions'
import { EntityOp } from '@ngrx/data'
import { BlockModel } from '../../../../models/block.model'
import { PanelModel } from '../../../../models/panel.model'
import { selectCurrentProjectId } from '../../store/projects/projects.selectors'
import { lastValueFrom } from 'rxjs'
import { HttpClient } from '@angular/common/http'
import { Update } from '@ngrx/entity'

@Injectable()
export class PanelsEntityEffects {
  addPanel$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(`${DataEntities.Panel} ${EntityOp.SAVE_ADD_ONE_SUCCESS}`),
        tap((action: any) => {
          const panel: PanelModel = action.payload.data
          if (panel.has_child_block) {
            this.store.dispatch(
              BlocksStateActions.updateBlockForGrid({
                block: {
                  id: panel.child_block_id!,
                  location: panel.location,
                  model: UnitModel.PANEL,
                  project_id: panel.project_id!,
                },
              }),
            )
          } else {
            this.store.dispatch(
              BlocksStateActions.addBlockForGrid({
                block: {
                  id: panel.id,
                  location: panel.location,
                  model: UnitModel.PANEL,
                  project_id: panel.project_id!,
                },
              }),
            )
          }
        }),
      ),
    { dispatch: false },
  )
  getAllPanels$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(`${DataEntities.Panel} ${EntityOp.QUERY_ALL_SUCCESS}`),
        tap((action: any) => {
          const blocks: BlockModel[] = action.payload.data.map((panel: PanelModel) => {
            const block: BlockModel = {
              id: panel.id,
              location: panel.location,
              model: UnitModel.PANEL,
              project_id: panel.project_id!,
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
                project_id: data.changes.project_id!,
              },
            }),
          )
        }),
      ),
    { dispatch: false },
  )

  updateManyPanels$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(`${DataEntities.Panel} ${EntityOp.UPDATE_MANY}`),
        concatLatestFrom(() => this.store.select(selectCurrentProjectId)),
        tap(async ([action, projectId]: [any, number]) => {
          const manyPanels: PanelModel[] = action.payload.data
          const blocks = manyPanels.map((panel) => {
            const block: Update<BlockModel> = {
              id: panel.id,
              changes: {
                id: panel.id,
                location: panel.location,
              },
            }
            return block
          })
          this.store.dispatch(
            BlocksStateActions.updateManyBlocksForGrid({
              blocks,
            }),
          )

          await lastValueFrom(
            this.http.post(`/api/projects/${projectId}/panels`, {
              panels: manyPanels,
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

  constructor(
    private actions$: Actions,
    private panelsService: PanelsService,
    private panelsEntity: PanelsEntityService,
    private store: Store<AppState>,
    private http: HttpClient,
  ) {}
}
