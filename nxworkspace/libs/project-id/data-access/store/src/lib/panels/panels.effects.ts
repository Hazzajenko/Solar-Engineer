import { inject, Injectable } from '@angular/core'
import { tapResponse } from '@ngrx/component-store'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { Update } from '@ngrx/entity'
import { Store } from '@ngrx/store'
import { PanelsService } from '@project-id/data-access/api'
import { ProjectsActions, ProjectsFacade } from '@projects/data-access/store'
import { BlockModel, BlockType, PanelModel } from '@shared/data-access/models'
import { of, switchMap, tap } from 'rxjs'
import { map } from 'rxjs/operators'
import { BlocksActions } from '../blocks/blocks.actions'
import { PanelsActions } from './panels.actions'

@Injectable({
  providedIn: 'root',
})
export class PanelsEffects {
  private actions$ = inject(Actions)
  private store = inject(Store)
  loadPanelsSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(PanelsActions.loadPanelsSuccess),
        tap(({ panels }) => {
          const blocks = panels.map((panel) => {
            return new BlockModel(
              {
                projectId: panel.projectId,
                location: panel.location,
                type: BlockType.PANEL,
              },
              panel.id,
            )
          })
          this.store.dispatch(BlocksActions.addManyBlocksForGrid({ blocks }))
        }),
      ),
    { dispatch: false },
  )
  private panelsService = inject(PanelsService)
  private projectsFacade = inject(ProjectsFacade)
  initPanels$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ProjectsActions.initSelectProject),
        switchMap(({ projectId }) =>
          this.panelsService.getPanelsByProjectId(projectId).pipe(
            tapResponse(
              (panels: PanelModel[]) =>
                this.store.dispatch(PanelsActions.loadPanelsSuccess({ panels })),
              (error: Error) =>
                this.store.dispatch(PanelsActions.loadPanelsFailure({ error: error.message })),
            ),
          ),
        ),
      ),
    { dispatch: false },
  )
  initLocalPanels$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProjectsActions.initLocalProject),
      switchMap(({ localProject }) =>
        of(PanelsActions.loadPanelsSuccess({ panels: localProject.panels })),
      ),
    ),
  )
  addPanel$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(PanelsActions.addPanel),
        tap(({ panel }) => {
          this.store.dispatch(
            BlocksActions.addBlockForGrid({
              block: {
                id: panel.id,
                location: panel.location,
                type: BlockType.PANEL,
                projectId: panel.projectId,
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
        ofType(PanelsActions.addManyPanels),
        map(({ panels }) => {
          return panels.map((panel: PanelModel) => {
            const block: BlockModel = {
              id: panel.id,
              location: panel.location,
              type: BlockType.PANEL,
              projectId: panel.projectId,
            }
            return block
          })
        }),
        tap((blocks) => this.store.dispatch(BlocksActions.addManyBlocksForGrid({ blocks }))),
      ),
    { dispatch: false },
  )
  /*   this.http.post(`/api/projects/${projectId}/panels`, {
    stringId: stringId ? stringId : 'undefined',
    panels: manyPanels,
  }), */
  updateOnePanel$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PanelsActions.updatePanel),
      switchMap(({ update }) =>
        of(
          BlocksActions.updateBlockForGrid({
            update,
          }),
        ),
      ),
    ),
  )

  /*
  updateOnePanel$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(PanelsActions.updatePanel),
        tap(({ update }) => {
          this.store.dispatch(
            BlocksActions.updateBlockForGrid({
              update,
            }),
          )
        }),
        switchMap(({ update }) =>
          this.projectsFacade.projectFromRoute$.pipe(combineLatestWith(of(update))),
        ),
        switchMap(([project, update]) => {
          if (!project) return of(undefined)
          return this.panelsService.updatePanel(update, project.id)
        }),
      ),
    { dispatch: false },
  ) */

  updateManyPanels$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(PanelsActions.updateManyPanels),
        map(
          ({ updates }) =>
            updates.map((update) => {
              const blockUpdate: Update<BlockModel> = {
                id: update.id.toString(),
                changes: {
                  location: update.changes.location,
                },
              }
              return blockUpdate
            }),
          // return of(BlocksActions.updateManyBlocksForGrid({ updates: blockUpdates }))
        ),
        switchMap((updates) => of(BlocksActions.updateManyBlocksForGrid({ updates }))),
        /*         switchMap(({ updates }) => {
          const blockUpdates = updates.map((update) => {
            const blockUpdate: Update<BlockModel> = {
              id: update.id.toString(),
              changes: {
                location: update.changes.location,
              },
            }
            return blockUpdate
          })
          return of(BlocksActions.updateManyBlocksForGrid({ updates: blockUpdates }))
        }), */
        // tap(updates => this.store.dispatch(BlocksActions.updateManyBlocksForGrid({updates})))
        /*  concatLatestFrom(() => this.store.select(selectCurrentProjectId)),
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
          ).then((res) => console.log(res)) */
        // }),
      ),
    // { dispatch: false },
  )
}
