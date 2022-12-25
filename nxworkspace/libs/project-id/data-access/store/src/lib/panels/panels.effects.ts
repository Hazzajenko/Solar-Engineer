import { inject, Injectable } from '@angular/core'
import { tapResponse } from '@ngrx/component-store'
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects'
import { Store } from '@ngrx/store'
import { PanelsService } from '@project-id/data-access/api'
import { ProjectsActions, ProjectsFacade } from '@projects/data-access/store'
import { BlockModel, BlockType, PanelModel, ProjectModel } from '@shared/data-access/models'
import { of, switchMap, tap } from 'rxjs'
import { combineLatestWith, map } from 'rxjs/operators'
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
            return new BlockModel({
              id: panel.id,
              projectId: panel.projectId,
              location: panel.location,
              type: BlockType.PANEL,
            })
          })
          this.store.dispatch(BlocksActions.addManyBlocksForGrid({ blocks }))
        }),
      ),
    { dispatch: false },
  )
  private panelsService = inject(PanelsService)
  private projectsFacade = inject(ProjectsFacade)
  initStrings$ = createEffect(
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
        concatLatestFrom(() => this.projectsFacade.projectFromRoute$),
      ),
    map(
      ([{ panels }, project]: [{ panels: PanelModel[] }, ProjectModel]) =>
        panels.map((panel: PanelModel) => {
          const block: BlockModel = {
            id: panel.id,
            location: panel.location,
            type: BlockType.PANEL,
            projectId: project.id,
          }
          return block
        }),
      // return blocks
    ),
    map((blocks) => blocks),
  )
  /*   this.http.post(`/api/projects/${projectId}/panels`, {
    stringId: stringId ? stringId : 'undefined',
    panels: manyPanels,
  }), */
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
  )
}
