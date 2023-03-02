import { inject, Injectable } from '@angular/core'
import { tapResponse } from '@ngrx/component-store'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { Store } from '@ngrx/store'
import { ProjectsService } from '@projects/data-access/api'
import { ProjectModel } from '@shared/data-access/models'
import { catchError, map, of, switchMap } from 'rxjs'
import { ProjectsActions } from '@projects/data-access/store'
import { AuthActions } from '@auth/data-access'
// import { tap } from 'rxjs/operators'
import { ProjectsSignalrService } from '../api'

@Injectable({
  providedIn: 'root',
})
export class ProjectsEffects {
  private actions$ = inject(Actions)
  private projectsService = inject(ProjectsService)
  private projectsSignalrService = inject(ProjectsSignalrService)
  private store = inject(Store)

  initProjectsConnection$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.signInSuccess),
        map(({ token }) => {
          this.projectsSignalrService.createProjectsHubConnection(token)
        }),
      ),
    { dispatch: false },
  )
  init$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ProjectsActions.initProjects),
        switchMap(() =>
          this.projectsService.getUserProjects().pipe(
            tapResponse(
              (projects: ProjectModel[]) =>
                this.store.dispatch(ProjectsActions.loadProjectsSuccess({ projects })),
              (error: Error) =>
                this.store.dispatch(ProjectsActions.loadProjectsFailure({ error: error.message })),
            ),
          ),
        ),
      ),
    { dispatch: false },
  )

  initLocalProject$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProjectsActions.initLocalProject),
      switchMap(({ localProject }) =>
        of(ProjectsActions.loadLocalProjectSuccess({ project: localProject.project })),
      ),
    ),
  )

  createWebProject$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProjectsActions.createWebProject),
      switchMap(({ projectName }) =>
        this.projectsService.createWebProject(projectName).pipe(
          map(() => ProjectsActions.createWebProjectSuccess()),
          // map(project => ProjectsActions.createWebProjectSuccess({ project })),
        ),
      ),
      catchError((error: Error) =>
        of(ProjectsActions.createWebProjectError({ error: error.message })),
      ),
    ),
  )

  /*  createWebProjectSuccess$ = createEffect(() =>
      this.actions$.pipe(
        ofType(ProjectsActions.createWebProjectSuccess),
        map(({ project }) =>
          ProjectsActions.initSelectProject({ projectId: project.id }),
        ),
      ),
    )*/

  /*     initSelectProject$ = createEffect(
      () =>
        this.actions$.pipe(
          ofType(ProjectsActions.initSelectProject),
          tap(({ projectId }) => {
            this.store.dispatch(StringsActions.initStrings({ projectId }))
            this.store.dispatch(PanelsActions.initPanels({ projectId }))
            this.store.dispatch(LinksActions.initLinks({ projectId }))
          }),
        ),
      { dispatch: false },
    ) */
}
