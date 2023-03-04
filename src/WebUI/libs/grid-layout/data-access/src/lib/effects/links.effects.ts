import { inject, Injectable } from '@angular/core'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { Store } from '@ngrx/store'
import { LinksService } from '../api'
import { EntitiesActions, LinksActions } from '../store'
import { LinksPathService } from '../services'
import { ProjectsStoreService } from '@projects/data-access'
import { ProjectsActions } from '@projects/data-access'
import { catchError, map, of, switchMap } from 'rxjs'

@Injectable()
export class LinksEffects {
  private actions$ = inject(Actions)
  private store = inject(Store)
  private linksService = inject(LinksService)
  private projectsStore = inject(ProjectsStoreService)
  loadLinksSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LinksActions.loadLinksSuccess),
      map(({ links }) => EntitiesActions.addManyEntitiesForGrid({ entities: links })),
    ),
  )

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
  )
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
