import { inject, Injectable } from '@angular/core'
import { tapResponse } from '@ngrx/component-store'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { Store } from '@ngrx/store'
import { ProjectsService } from '@projects/data-access/api'
import { ProjectModel } from '@shared/data-access/models'
import { switchMap } from 'rxjs'
import { ProjectsActions } from './projects.actions'

@Injectable({
  providedIn: 'root',
})
export class ProjectsEffects {
  private actions$ = inject(Actions)
  private projectsService = inject(ProjectsService)
  private store = inject(Store)
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

/*   initSelectProject$ = createEffect(
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
