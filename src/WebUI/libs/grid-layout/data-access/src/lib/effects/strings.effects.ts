import { inject, Injectable } from '@angular/core'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { Store } from '@ngrx/store'
import { EntitiesActions, ProjectsHubService, StringsActions, StringsService } from '../'
import { ProjectsActions, ProjectsStoreService, SignalrEventsService } from '@projects/data-access'
import { combineLatestWith, map, tap } from 'rxjs'
import { StringsSignalrService } from '../api/strings/strings-signalr.service'
import { getGuid } from '@shared/utils'
import {
  PROJECT_ITEM_TYPE,
  PROJECT_SIGNALR_TYPE,
  ProjectEventAction,
  ProjectItemType,
  ProjectSignalrJsonRequest,
} from '@shared/data-access/models'
import { BaseService } from '@shared/logger'

// import { SignalrEventsService } from '@app/data-access/signalr'

@Injectable({
  providedIn: 'root',
})
export class StringsEffects extends BaseService {
  private actions$ = inject(Actions)
  private store = inject(Store)

  private stringsService = inject(StringsService)
  private stringsSignalrService = inject(StringsSignalrService)
  private projectsStore = inject(ProjectsStoreService)
  private projectsHubService = inject(ProjectsHubService)
  private signalrEventsService = inject(SignalrEventsService)

  /*  constructor(logger: LoggerService) {
      super(logger)
    }*/

  /*  initStrings$ = createEffect(() =>
      this.actions$.pipe(
        ofType(ProjectsActions.initSelectProject),
        switchMap(({ projectId }) =>
          this.stringsService.getStringsByProjectId(projectId).pipe(
            map((string) => StringsActions.loadStringsSuccess({ string })),
            catchError((error) => of(StringsActions.loadStringsFailure({ error: error.message }))),
          ),
        ),
      ),
    )*/

  /* loadStringsSuccess$ = createEffect(() =>
     this.actions$.pipe(
       ofType(StringsActions.loadStringsSuccess),
       map(({ string }) => EntitiesActions.addManyEntitiesForGrid({ entities: string })),
     ),
   )
 */
  initLocalStrings$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProjectsActions.initLocalProject),
      map(({ localProject }) =>
        StringsActions.loadStringsSuccess({ strings: localProject.strings }),
      ),
    ),
  )

  addStringEntity$ = createEffect(() =>
    this.actions$.pipe(
      ofType(StringsActions.addString),
      map(({ string }) => EntitiesActions.addEntityForGrid({ entity: string })),
    ),
  )

  addStringSignalR$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(StringsActions.addString),
        combineLatestWith(this.projectsStore.select.selectedProject$),
        map(([{ string }, project]) => {
          project = this.throwIfNull(project, 'No project selected')
          const action: ProjectEventAction = PROJECT_SIGNALR_TYPE.CREATE
          const model: ProjectItemType = PROJECT_ITEM_TYPE.STRING
          const projectSignalrEvent: ProjectSignalrJsonRequest = {
            action,
            model,
            projectId: project.id,
            requestId: getGuid(),
            data: JSON.stringify(string),
          }
          return projectSignalrEvent
        }),
        tap((signalrRequest) => this.signalrEventsService.sendProjectSignalrEvent(signalrRequest)),
      ),
    { dispatch: false },
  )

  createStringWithPanelsSignalR$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(StringsActions.createStringWithPanels),
        combineLatestWith(this.projectsStore.select.selectedProject$),
        map(([{ string, panelIds }, project]) => {
          project = this.throwIfNull(project, 'No project selected')
          const action: ProjectEventAction = PROJECT_SIGNALR_TYPE.CREATE
          const model: ProjectItemType = PROJECT_ITEM_TYPE.STRING
          const panelIdsRequest = panelIds.map((panelId) => ({ id: panelId }))
          const createStringRequest = {
            ...string,
            panelIds: panelIdsRequest,
          }
          const projectSignalrEvent: ProjectSignalrJsonRequest = {
            action,
            model,
            projectId: project.id,
            requestId: getGuid(),
            data: JSON.stringify(createStringRequest),
          }
          return projectSignalrEvent
        }),
        tap((signalrRequest) => this.signalrEventsService.sendProjectSignalrEvent(signalrRequest)),
      ),
    { dispatch: false },
  )

  deleteStringSignalR$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(StringsActions.deleteString),
        combineLatestWith(this.projectsStore.select.selectedProject$),
        map(([{ stringId }, project]) => {
          project = this.throwIfNull(project, 'No project selected')
          const action: ProjectEventAction = PROJECT_SIGNALR_TYPE.DELETE
          const model: ProjectItemType = PROJECT_ITEM_TYPE.STRING

          const deleteRequest = {
            id: stringId,
          }

          const projectSignalrEvent: ProjectSignalrJsonRequest = {
            action,
            model,
            projectId: project.id,
            requestId: getGuid(),
            data: JSON.stringify(deleteRequest),
          }
          return projectSignalrEvent
        }),
        tap((signalrRequest) => this.signalrEventsService.sendProjectSignalrEvent(signalrRequest)),
      ),
    { dispatch: false },
  )

  /* addStringHttp$ = createEffect(
     () =>
       this.actions$.pipe(
         ofType(StringsActions.addString),
         switchMap(({ string }) =>
           this.projectsStore.select.selectIsWebProject$.pipe(
             switchMap((isWeb) => {
               if (isWeb) {
                 return this.stringsService.addString(string)
               }
               // update local state
               return of(undefined)
             }),
           ),
         ),
       ),
     { dispatch: false },
   )*/

  /*  deleteStringHttp$ = createEffect(
      () =>
        this.actions$.pipe(
          ofType(StringsActions.deleteString),
          switchMap(({ stringId }) =>
            this.projectsStore.select.isWebWithProject$.pipe(
              switchMap(([isWeb, project]) => {
                if (!project) return of(undefined)
                if (isWeb) {
                  return this.stringsService.deleteString(stringId, project.id)
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
