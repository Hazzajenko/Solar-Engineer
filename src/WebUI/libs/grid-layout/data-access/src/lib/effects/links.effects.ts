import { inject, Injectable } from '@angular/core'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { Store } from '@ngrx/store'
import { LinksService } from '../api'
import { EntitiesActions, LinksActions } from '../store'
import { LinksPathService } from '../services'
import { ProjectsActions, ProjectsStoreService, SignalrEventsService } from '@projects/data-access'
import { combineLatestWith, map, of, switchMap, tap } from 'rxjs'
import {
  PROJECT_ITEM_TYPE,
  PROJECT_SIGNALR_TYPE,
  ProjectEventAction,
  ProjectItemType,
  ProjectSignalrJsonRequest,
} from '@shared/data-access/models'
import { getGuid } from '@shared/utils'
import { Logger, LoggerService } from '@shared/logger'

@Injectable()
export class LinksEffects extends Logger {
  private actions$ = inject(Actions)
  private store = inject(Store)
  private linksService = inject(LinksService)
  private projectsStore = inject(ProjectsStoreService)
  private signalrEventsService = inject(SignalrEventsService)

  constructor(logger: LoggerService) {
    super(logger)
  }

  loadLinksSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LinksActions.loadLinksSuccess),
      map(({ links }) => EntitiesActions.addManyEntitiesForGrid({ entities: links })),
    ),
  )
  /*
    initLinks$ = createEffect(() =>
      this.actions$.pipe(
        ofType(ProjectsActions.initSelectProject),
        switchMap(({ projectId }) =>
          this.linksService.getLinksByProjectId(projectId).pipe(
            map((links) => LinksActions.loadLinksSuccess({ links })),
            catchError((error) => of(LinksActions.loadLinksFailure({ error: error.message }))),
          ),
        ),
      ),
    )*/
  initLocalLinks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProjectsActions.initLocalProject),
      map(({ localProject }) => LinksActions.loadLinksSuccess({ links: localProject.links })),
    ),
  )

  addLink$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LinksActions.addLink),
      map(({ link }) => EntitiesActions.addEntityForGrid({ entity: link })),
    ),
  )

  addLinkSignalR$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(LinksActions.addLink),
        combineLatestWith(this.projectsStore.select.selectedProject$),
        map(([{ link }, project]) => {
          // map(({ panel }) => {
          project = this.throwIfNull(project, 'project is null')
          const action: ProjectEventAction = PROJECT_SIGNALR_TYPE.CREATE
          const model: ProjectItemType = PROJECT_ITEM_TYPE.PANEL_LINK
          const projectSignalrEvent: ProjectSignalrJsonRequest = {
            action,
            model,
            projectId: project.id,
            requestId: getGuid(),
            data: JSON.stringify(link),
          }
          return projectSignalrEvent
        }),
        tap((signalrRequest) => this.signalrEventsService.sendProjectSignalrEvent(signalrRequest)),
      ),
    { dispatch: false },
  )

  /*
    addLinkHttp$ = createEffect(
      () =>
        this.actions$.pipe(
          ofType(LinksActions.addLink),
          switchMap(({ link }) =>
            this.projectsStore.select.selectIsWebProject$.pipe(
              switchMap((isWeb) => {
                if (isWeb) {
                  return this.linksService.addLink(link)
                }
                // update local state
                return of(undefined)
              }),
            ),
          ),
        ),
      { dispatch: false },
    )
  */

  private linksPathService = inject(LinksPathService)

  deleteLink$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LinksActions.deleteLink),
      map(({ linkId }) =>
        EntitiesActions.deleteEntityForGrid({
          entityId: linkId,
        }),
      ),
    ),
  )

  deleteLinkHttp$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(LinksActions.deleteLink),
        switchMap(({ linkId }) =>
          this.projectsStore.select.isWebWithProject$.pipe(
            switchMap(([isWeb, project]) => {
              if (!project) return of(undefined)
              if (isWeb) {
                return this.linksService.deleteLink(linkId, project.id)
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
