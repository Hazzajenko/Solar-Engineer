import { Injectable } from '@angular/core'
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects'
import { Store } from '@ngrx/store'
import { AppState } from '../../../../../store/app.state'
import { PanelsService } from '../../../../services/panels.service'
import { PanelsEntityService } from './panels-entity.service'
import { switchMap, tap } from 'rxjs/operators'
import { BlocksStateActions } from '../../store/blocks/blocks.actions'
import { UnitModel } from '../../../../models/unit.model'
import { DataEntities } from '../data-actions'
import { EntityOp } from '@ngrx/data'
import { BlockModel } from '../../../../models/block.model'
import { PanelModel } from '../../../../models/panel.model'
import { selectCurrentProjectId } from '../../store/projects/projects.selectors'
import { firstValueFrom, lastValueFrom } from 'rxjs'
import { HttpClient } from '@angular/common/http'
import { Update } from '@ngrx/entity'
import { selectSelectedStringId } from '../../store/selected/selected.selectors'

@Injectable()
export class PanelsEntityEffects {
  addPanel$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(`${DataEntities.Panel} ${EntityOp.SAVE_ADD_ONE_SUCCESS}`),
        tap((action: any) => {
          const panel: PanelModel = action.payload.data
          this.store.dispatch(
            BlocksStateActions.addBlockForGrid({
              block: {
                id: panel.id,
                location: panel.location,
                model: UnitModel.PANEL,
                projectId: panel.projectId!,
              },
            }),
          )
        }),
      ),
    { dispatch: false },
  )

  addManyPanels$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(`${DataEntities.Panel} ${EntityOp.ADD_MANY}`),
        concatLatestFrom(() => this.store.select(selectCurrentProjectId)),
        tap(([action, projectId]: [any, number]) => {
          const manyPanels: PanelModel[] = action.payload.data

          const blocks: BlockModel[] = manyPanels.map((panel: PanelModel) => {
            const block: BlockModel = {
              id: panel.id,
              location: panel.location,
              model: UnitModel.PANEL,
              projectId: projectId,
            }
            return block
          })
          this.store.dispatch(
            BlocksStateActions.addManyBlocksForGrid({
              blocks,
            }),
          )
          firstValueFrom(
            this.store.select(selectSelectedStringId).pipe(
              switchMap((stringId) =>
                this.http.post(`/api/projects/${projectId}/panels`, {
                  stringId: stringId ? stringId : 'undefined',
                  panels: manyPanels,
                }),
              ),
            ),
          ).then((r) => console.log(r))
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
              projectId: panel.projectId!,
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
          const data = action.payload.data.changes
          this.store.dispatch(
            BlocksStateActions.updateBlockForGrid({
              block: {
                id: data.id,
                location: data.location,
                model: UnitModel.PANEL,
                projectId: data.projectId!,
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
        tap(([action, projectId]: [any, number]) => {
          const manyPanels: any = action.payload.data
          console.log(manyPanels)
          const blocks = manyPanels.map((arr: any) => {
            let panel: PanelModel = arr.changes
            const block: Update<BlockModel> = {
              id: arr.id,
              changes: {
                id: arr.id,
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
          const panelChanges = manyPanels.map((mps: { changes: any }) => mps.changes)

          lastValueFrom(
            this.http.put(`/api/projects/${projectId}/panels`, {
              panels: panelChanges,
            }),
          ).then((res) => console.log(res))
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

  deleteManyPanels$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(`${DataEntities.Panel} ${EntityOp.SAVE_DELETE_MANY}`),
        concatLatestFrom(() => this.store.select(selectCurrentProjectId)),
        tap(([action, projectId]: [any, number]) => {
          const manyPanels: any = action.payload.data
          console.log(manyPanels)
          const blocks = manyPanels.map((arr: any) => {
            let panel: PanelModel = arr.changes
            const block: Update<BlockModel> = {
              id: arr.id,
              changes: {
                id: arr.id,
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
          const panelChanges = manyPanels.map((mps: { changes: any }) => mps.changes)

          lastValueFrom(
            this.http.put(`/api/projects/${projectId}/panels`, {
              panels: panelChanges,
            }),
          ).then((res) => console.log(res))
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
