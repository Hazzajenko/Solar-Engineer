import { inject, Injectable } from '@angular/core'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { Store } from '@ngrx/store'
import { GridPanelsStoreService, GridStringsActions, PanelsService, PanelsSignalrService, ProjectsHubService } from '../'
import { BlocksActions, GridPanelsActions } from '../store'
import { ProjectsActions, ProjectsStoreService, SignalrEventsService } from '@projects/data-access'
import { combineLatestWith, of, switchMap, tap } from 'rxjs'
import { map } from 'rxjs/operators'
import { BaseService } from '@shared/logger'
import { newGuid } from '@shared/utils'
import { PROJECT_ITEM_TYPE, PROJECT_SIGNALR_TYPE, ProjectEventAction, ProjectItemType, ProjectSignalrJsonRequest } from '@shared/data-access/models'
// import { SignalrEventsService } from '@app/data-access/signalr'

// import { SignalrRequest } from '@shared/data-access/models'

@Injectable({
  providedIn: 'root',
})
export class GridPanelsEffects
  extends BaseService {
  private actions$ = inject(Actions)
  private store = inject(Store)

  // private panelsService = inject(PathsEventService)
  // private projectsFacade = inject(ProjectsFacade)
  private projectsStore = inject(ProjectsStoreService)
  private panelsService = inject(PanelsService)
  private panelsStore = inject(GridPanelsStoreService)
  private panelsSignalrService = inject(PanelsSignalrService)
  // private logger = inject(LoggerService)
  private projectsHubService = inject(ProjectsHubService)
  private signalrEventsService = inject(SignalrEventsService)

  /*  constructor(logger: LoggerService) {
   super(logger)
   }*/

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
      ofType(GridPanelsActions.loadPanelsSuccess),
      map(({ panels }) => BlocksActions.addManyBlocksForGrid({ blocks: panels })),
    ),
  )
  initLocalPanels$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProjectsActions.initLocalProject),
      switchMap(({ localProject }) =>
        of(GridPanelsActions.loadPanelsSuccess({ panels: localProject.panels })),
      ),
    ),
  )
  addPanel$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GridPanelsActions.addPanel),
      map(({ panel }) => BlocksActions.addBlockForGrid({ block: panel })),
    ),
  )

  /**
   * ! Removed for debugging
   */
  /*  addPanelSignalR$ = createEffect(
   () =>
   this.actions$.pipe(
   ofType(GridPanelsActions.addPanel),
   combineLatestWith(this.projectsStore.select.selectedProject$),
   map(([{ panel }, project]) => {
   // map(({ panel }) => {
   project = this.throwIfNull(project, 'project is null')
   const action: ProjectEventAction = PROJECT_SIGNALR_TYPE.CREATE
   const model: ProjectItemType = PROJECT_ITEM_TYPE.PANEL
   const projectSignalrEvent: ProjectSignalrJsonRequest = {
   action,
   model,
   projectId: project.id,
   requestId: newGuid(),
   data:      JSON.stringify(panel),
   }
   return projectSignalrEvent
   }),
   tap((signalrRequest) => this.signalrEventsService.sendProjectSignalrEvent(signalrRequest)),
   ),
   { dispatch: false },
   )*/

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
      ofType(GridPanelsActions.addManyPanels),
      map(({ panels }) => BlocksActions.addManyBlocksForGrid({ blocks: panels })),
    ),
  )

  addManyPanelsSignalr$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(GridPanelsActions.addManyPanels),
        combineLatestWith(this.projectsStore.select.selectedProject$),
        map(([{ panels }, project]) => {
          // map(({ panels }) => {
          project = this.throwIfNull(project, 'project is null')
          const action: ProjectEventAction = PROJECT_SIGNALR_TYPE.CREATE_MANY
          const model: ProjectItemType = PROJECT_ITEM_TYPE.PANEL
          const createManyPanelsRequest = {
            projectId:     project.id,
            stringId:      panels[0].stringId,
            panelConfigId: panels[0].panelConfigId,
            rotation:      panels[0].rotation,
            panels,
          }
          const projectSignalrEvent: ProjectSignalrJsonRequest = {
            action,
            model,
            projectId: project.id,
            requestId: newGuid(),
            data:      JSON.stringify(createManyPanelsRequest),
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
      ofType(GridPanelsActions.updatePanel),
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
        ofType(GridPanelsActions.updatePanel),
        combineLatestWith(this.projectsStore.select.selectedProject$),
        map(([{ update }, project]) => {
          project = this.throwIfNull(project, 'project is null')
          const action: ProjectEventAction = PROJECT_SIGNALR_TYPE.UPDATE
          const model: ProjectItemType = PROJECT_ITEM_TYPE.PANEL
          const projectSignalrEvent: ProjectSignalrJsonRequest = {
            action,
            model,
            projectId: project.id,
            requestId: newGuid(),
            data:      JSON.stringify(update),
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
      ofType(GridPanelsActions.updateManyPanels),
      map(({ updates }) => BlocksActions.updateManyBlocksForGrid({ updates })),
    ),
  )

  updateManyPanelsWithoutSignalr$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GridPanelsActions.updateManyPanelsWithoutSignalr),
      map(({ updates }) => BlocksActions.updateManyBlocksForGrid({ updates })),
    ),
  )

  createStringWithPanels$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(GridStringsActions.createStringWithPanels),
        combineLatestWith(this.projectsStore.select.selectedProject$),
        map(([{ panelIds, string }, project]) => {
          this.throwIfNull(project, 'project is null')
          const updates = panelIds.map((panelId) => {
            return {
              id:      panelId,
              changes: {
                stringId: string.id,
              },
            }
          })
          return GridPanelsActions.updateManyPanelsWithoutSignalr({ updates })
          // project = this.throwIfNull(project, 'project is null')
          /*      const action: ProjectEventAction = PROJECT_SIGNALR_TYPE.UPDATE_MANY
           const model: ProjectItemType = PROJECT_ITEM_TYPE.PANEL
           const projectSignalrEvent: ProjectSignalrJsonRequest = {
           action,
           model,
           projectId: project.id,
           requestId: getGuid(),
           data: JSON.stringify(updates),
           }
           return projectSignalrEvent*/
        }),
      ),
    { dispatch: false },
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
      ofType(GridPanelsActions.deletePanel),
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
        ofType(GridPanelsActions.deletePanel),
        combineLatestWith(this.projectsStore.select.selectedProject$),
        map(([{ panelId }, project]) => {
          // if (!project) throw new Error('No project selected')
          project = this.throwIfNull(project, 'No project selected')
          // const project = await this.projectsStore.select.selectedProject()
          const action: ProjectEventAction = PROJECT_SIGNALR_TYPE.DELETE
          const model: ProjectItemType = PROJECT_ITEM_TYPE.PANEL

          const deleteRequest = {
            id: panelId,
          }

          const projectSignalrEvent: ProjectSignalrJsonRequest = {
            action,
            model,
            projectId: project.id,
            requestId: newGuid(),
            data:      JSON.stringify(deleteRequest),
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
      ofType(GridPanelsActions.deleteManyPanels),
      map(({ panelIds }) =>
        BlocksActions.deleteManyBlocksForGrid({
          blockIds: panelIds,
        }),
      ),
    ),
  )

  deleteManyPanelsSignalr$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(GridPanelsActions.deleteManyPanels),
        combineLatestWith(this.projectsStore.select.selectedProject$),
        map(([{ panelIds }, project]) => {
          project = this.throwIfNull(project, 'No project selected')
          const action: ProjectEventAction = PROJECT_SIGNALR_TYPE.DELETE_MANY
          const model: ProjectItemType = PROJECT_ITEM_TYPE.PANEL

          const panelIdsRequest = panelIds.map((panelId) => ({
            id: panelId,
          }))

          const deleteManyRequest = {
            projectId: project.id,
            panelIds:  panelIdsRequest,
          }

          const projectSignalrEvent: ProjectSignalrJsonRequest = {
            action,
            model,
            projectId: project.id,
            requestId: newGuid(),
            data:      JSON.stringify(deleteManyRequest),
          }
          return projectSignalrEvent
        }),
        tap((signalrRequest) => this.signalrEventsService.sendProjectSignalrEvent(signalrRequest)),
      ),
    { dispatch: false },
  )

  /* deleteManyPanelsHttp$ = createEffect(
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
   )*/
}
