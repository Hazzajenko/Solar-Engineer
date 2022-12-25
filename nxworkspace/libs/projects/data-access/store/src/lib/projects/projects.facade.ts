import { inject, Injectable } from '@angular/core'
import { select, Store } from '@ngrx/store'
import { ProjectsActions } from './projects.actions'
import * as ProjectsSelectors from './projects.selectors'

@Injectable({ providedIn: 'root' })
export class ProjectsFacade {
  private readonly store = inject(Store)
  loaded$ = this.store.pipe(select(ProjectsSelectors.selectProjectsLoaded))
  allProjects$ = this.store.pipe(select(ProjectsSelectors.selectAllProjects))
  selectedProjects$ = this.store.pipe(select(ProjectsSelectors.selectEntity))
  projectFromRoute$ = this.store.select(ProjectsSelectors.selectProjectByRouteParams)

  init() {
    this.store.dispatch(ProjectsActions.initProjects())
  }

  initSelectProject(projectId: number) {
    this.store.dispatch(ProjectsActions.initSelectProject({ projectId }))
  }
}
