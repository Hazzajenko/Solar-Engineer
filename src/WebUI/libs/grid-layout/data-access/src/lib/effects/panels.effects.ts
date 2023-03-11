import { inject, Injectable } from '@angular/core'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { Store } from '@ngrx/store'
import { PanelsService, PanelsSignalrService, PanelsStoreService, ProjectsHubService } from '../'
import { BlocksActions, PanelsActions } from '../store'
import { ProjectsActions, ProjectsStoreService, SignalrEventsService } from '@projects/data-access'
import { of, switchMap, tap } from 'rxjs'
import { map } from 'rxjs/operators'
import { LoggerService } from '@shared/logger'
import { getGuid } from '@shared/utils'
import {
  PROJECT_ITEM_TYPE,
  PROJECT_SIGNALR_TYPE,
  ProjectEventAction,
  ProjectItemType,
  ProjectSignalrJsonRequest,
} from '@shared/data-access/models'
// import { SignalrEventsService } from '@app/data-access/signalr'

// import { SignalrRequest } from '@shared/data-access/models'

@Injectable({
  providedIn: 'root',
})
export class PanelsEffects {
  private actions$ = inject(Actions)
  private store = inject(Store)

  // private panelsService = inject(PathsEventService)
  // private projectsFacade = inject(ProjectsFacade)
  private projectsStore = inject(ProjectsStoreService)
  private panelsService = inject(PanelsService)
  private panelsStore = inject(PanelsStoreService)
  private panelsSignalrService = inject(PanelsSignalrService)
  private logger = inject(LoggerService)
  private projectsHubService = inject(ProjectsHubService)
  private signalrEventsService = inject(SignalrEventsService)
  /*  initPanels$ = createEffect(
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
    )*/
  loadPanelsSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PanelsActions.loadPanelsSuccess),
      map(({ panels }) => BlocksActions.addManyBlocksForGrid({ blocks: panels })),
    ),
  )
  initLocalPanels$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProjectsActions.initLocalProject),
      switchMap(({ localProject }) =>
        of(PanelsActions.loadPanelsSuccess({ panels: localProject.panels })),
      ),
    ),
  )
  addPanel$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PanelsActions.addPanel),
      map(({ panel }) => BlocksActions.addBlockForGrid({ block: panel })),
    ),
  )

  addPanelSignalR$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(PanelsActions.addPanel),
        map(({ panel }) => {
          const action: ProjectEventAction = PROJECT_SIGNALR_TYPE.CREATE
          const model: ProjectItemType = PROJECT_ITEM_TYPE.PANEL
          const projectSignalrEvent: ProjectSignalrJsonRequest = {
            action,
            model,
            projectId: panel.projectId,
            requestId: getGuid(),
            data: JSON.stringify(panel),
          }
          return projectSignalrEvent
        }),
        tap((signalrRequest) => this.signalrEventsService.sendProjectSignalrEvent(signalrRequest)),
      ),
    { dispatch: false },
  )

  /*  addPanelBackend$ = createEffect(
      () =>
        this.actions$.pipe(
          ofType(PanelsActions.addPanel),
          switchMap(({ panel }) =>
            this.projectsStore.select.selectIsWebProject$.pipe(
              switchMap((isWeb) => {
                const isSignalr = true
                if (isSignalr) {
                  // const panelConfigId = panel.panelConfigId ? panel.panelConfigId : undefined
                  const request: CreatePanelRequest = {
                    id: panel.id,
                    projectId: panel.projectId,
                    stringId: panel.stringId,
                    location: panel.location,
                    panelConfigId: 'undefined',
                    rotation: panel.rotation,
                  }
                  console.log(request)
                  this.panelsSignalrService.addPanelSignalr(request)
                  return of(undefined)
                }
                if (isWeb) {
                  return this.panelsService.addPanel(panel)
                }
                // update local state
                return of(undefined)
              }),
            ),
          ),
        ),
      { dispatch: false },
    )*/

  addManyPanels$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PanelsActions.addManyPanels),
      map(({ panels }) => BlocksActions.addManyBlocksForGrid({ blocks: panels })),
    ),
  )

  addManyPanelsSignalr$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(PanelsActions.addManyPanels),
        map(({ panels }) => {
          const action: ProjectEventAction = PROJECT_SIGNALR_TYPE.CREATE_MANY
          const model: ProjectItemType = PROJECT_ITEM_TYPE.PANEL
          const createManyPanelsRequest = {
            projectId: panels[0].projectId,
            stringId: panels[0].stringId,
            panelConfigId: panels[0].panelConfigId,
            rotation: panels[0].rotation,
            panels,
          }
          const projectSignalrEvent: ProjectSignalrJsonRequest = {
            action,
            model,
            projectId: panels[0].projectId,
            requestId: getGuid(),
            data: JSON.stringify(createManyPanelsRequest),
          }
          return projectSignalrEvent
        }),
        tap((signalrRequest) => this.signalrEventsService.sendProjectSignalrEvent(signalrRequest)),
      ),
    { dispatch: false },
  )

  /*  addManyPanelsHttp$ = createEffect(
      () =>
        this.actions$.pipe(
          ofType(PanelsActions.addManyPanels),
          switchMap(({ panels }) =>
            this.projectsStore.select.isWebWithProject$.pipe(
              switchMap(([isWeb, project]) => {
                if (!project) return of(undefined)
                if (isWeb) {
                  return this.panelsService.addManyPanels(panels, project.id)
                }
                // update local state
                return of(undefined)
              }),
            ),
          ),
        ),
      { dispatch: false },
    )*/

  updateOnePanel$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PanelsActions.updatePanel),
      map(({ update }) =>
        BlocksActions.updateBlockForGrid({
          update,
        }),
      ),
    ),
  )

  updateOnePanelSignalr$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(PanelsActions.updatePanel),
        map(({ update }) => {
          const action: ProjectEventAction = PROJECT_SIGNALR_TYPE.UPDATE
          const model: ProjectItemType = PROJECT_ITEM_TYPE.PANEL
          const projectSignalrEvent: ProjectSignalrJsonRequest = {
            action,
            model,
            projectId: update.projectId,
            requestId: getGuid(),
            data: JSON.stringify(update),
          }
          return projectSignalrEvent
        }),
        tap((signalrRequest) => this.signalrEventsService.sendProjectSignalrEvent(signalrRequest)),
      ),
    { dispatch: false },
  )

  /*  updatePanelHttp$ = createEffect(
      () =>
        this.actions$.pipe(
          ofType(PanelsActions.updatePanel),
          switchMap(({ update }) =>
            this.projectsStore.select.isWebWithProject$.pipe(
              switchMap(([isWeb, project]) => {
                if (!project) return of(undefined)
                if (isWeb) {
                  return this.panelsService.updatePanel(update, project.id)
                }
                // update local state
                return of(undefined)
              }),
            ),
          ),
        ),
      { dispatch: false },
    )*/

  updateManyPanels$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PanelsActions.updateManyPanels),
      map(({ updates }) => BlocksActions.updateManyBlocksForGrid({ updates })),
    ),
  )

  /*  updateManyPanelsHttp$ = createEffect(
      () =>
        this.actions$.pipe(
          ofType(PanelsActions.updateManyPanels),
          switchMap(({ updates }) =>
            this.projectsStore.select.selectIsWebProject$.pipe(
              combineLatestWith(this.projectsStore.select.projectFromRoute$),
              switchMap(([isWeb, project]) => {
                if (!project) return of(undefined)
                if (isWeb) {
                  return this.panelsService.updateManyPanels(updates, project.id)
                }
                // update local state
                return of(undefined)
              }),
            ),
          ),
        ),
      { dispatch: false },
    )*/

  deletePanel$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PanelsActions.deletePanel),
      map(({ panelId }) =>
        BlocksActions.deleteBlockForGrid({
          blockId: panelId,
        }),
      ),
    ),
  )

  deletePanelSignalr$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(PanelsActions.deletePanel),
        map(async ({ panelId }) => {
          const project = await this.projectsStore.select.selectedProject()
          const action: ProjectEventAction = PROJECT_SIGNALR_TYPE.UPDATE
          const model: ProjectItemType = PROJECT_ITEM_TYPE.PANEL
          const projectSignalrEvent: ProjectSignalrJsonRequest = {
            action,
            model,
            projectId: project.id,
            requestId: getGuid(),
            data: JSON.stringify(update),
          }
          return projectSignalrEvent
        }),
        tap((signalrRequest) => this.signalrEventsService.sendProjectSignalrEvent(signalrRequest)),
      ),
    { dispatch: false },
  )

  /*  deletePanelHttp$ = createEffect(
      () =>
        this.actions$.pipe(
          ofType(PanelsActions.deletePanel),
          switchMap(({ panelId }) =>
            this.projectsStore.select.isWebWithProject$.pipe(
              switchMap(([isWeb, project]) => {
                if (!project) return of(undefined)
                if (isWeb) {
                  return this.panelsService.deletePanel(panelId, project.id)
                }
                // update local state
                return of(undefined)
              }),
            ),
          ),
        ),
      { dispatch: false },
    )*/

  deleteManyPanels$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PanelsActions.deleteManyPanels),
      map(({ panelIds }) =>
        BlocksActions.deleteManyBlocksForGrid({
          blockIds: panelIds,
        }),
      ),
    ),
  )

  deleteManyPanelsHttp$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(PanelsActions.deleteManyPanels),
        switchMap(({ panelIds }) =>
          this.projectsStore.select.isWebWithProject$.pipe(
            switchMap(([isWeb, project]) => {
              if (!project) return of(undefined)
              if (isWeb) {
                return this.panelsService.deleteManyPanels(panelIds, project.id)
              }
              // update local state
              return of(undefined)
            }),
          ),
        ),
      ),
    { dispatch: false },
  )
}
