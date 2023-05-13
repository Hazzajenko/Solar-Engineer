import { inject, Injectable } from '@angular/core'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { Store } from '@ngrx/store'
import { LinksService, PathsService } from '../api'
import { PathsActions } from '../store'
import { ProjectsStoreService } from '@projects/data-access'
import { ProjectsActions } from '@projects/data-access'
import { catchError, map, of, switchMap } from 'rxjs'

@Injectable()
export class PathsEffects {
  private actions$ = inject(Actions)
  private store = inject(Store)
  private linksService = inject(LinksService)
  private projectsStore = inject(ProjectsStoreService)
  private pathsService = inject(PathsService)

  /*  initPaths$ = createEffect(() =>
      this.actions$.pipe(
        ofType(ProjectsActions.initSelectProject),
        switchMap(({ projectId }) =>
          this.pathsService.getPathsByProjectId(projectId).pipe(
            map((paths) => PathsActions.loadPathsSuccess({ paths })),
            catchError((error) => of(PathsActions.loadPathsFailure({ error: error.message }))),
          ),
        ),
      ),
    )*/
  /*  initLocalPaths$ = createEffect(() =>
      this.actions$.pipe(
        ofType(ProjectsActions.initLocalProject),
        map(({ localProject }) => PathsActions.loadPathsSuccess({ paths: localProject. })),
      ),
    )*/
  /*
    addPath$ = createEffect(() =>
      this.actions$.pipe(
        ofType(PathsActions.addPath),
        map(({ path }) => EntitiesActions.addEntityForGrid({ entity: link })),
      ),
    )*/

  addPathHttp$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(PathsActions.addPath),
        switchMap(({ path }) =>
          this.projectsStore.select.isWebWithProject$.pipe(
            switchMap(([isWeb, project]) => {
              if (!project) return of(undefined)
              if (isWeb) {
                return this.pathsService.addPath(path, project.id)
              }
              // update local state
              return of(undefined)
            }),
          ),
        ),
      ),
    { dispatch: false },
  )

  updatePathHttp$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(PathsActions.updatePath),
        switchMap(({ update }) =>
          this.projectsStore.select.isWebWithProject$.pipe(
            switchMap(([isWeb, project]) => {
              if (!project) return of(undefined)
              if (isWeb) {
                return this.pathsService.updatePath(update, project.id)
              }
              // update local state
              return of(undefined)
            }),
          ),
        ),
      ),
    { dispatch: false },
  )

  deletePathHttp$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(PathsActions.deletePath),
        switchMap(({ pathId }) =>
          this.projectsStore.select.isWebWithProject$.pipe(
            switchMap(([isWeb, project]) => {
              if (!project) return of(undefined)
              if (isWeb) {
                return this.pathsService.deletePath(pathId, project.id)
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
