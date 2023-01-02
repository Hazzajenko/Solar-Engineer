import { firstValueFrom } from 'rxjs'
import { LocalProjectModel } from '@shared/data-access/models'
import { inject, Injectable } from '@angular/core'
import { Store } from '@ngrx/store'
import { ProjectsActions, ProjectsSelectors } from '@projects/data-access/store'

@Injectable({ providedIn: 'root' })
export class ProjectsFacade {
  private readonly store = inject(Store)
  loaded$ = this.store.select(ProjectsSelectors.selectProjectsLoaded)
  allProjects$ = this.store.select(ProjectsSelectors.selectAllProjects)
  selectedProjects$ = this.store.select(ProjectsSelectors.selectEntity)
  projectFromRoute$ = this.store.select(ProjectsSelectors.selectProjectByRouteParams)
  currentProjectId$ = this.store.select(ProjectsSelectors.selectProjectIdByRouteParams)
  projectFromRouteId$ = this.store.select(ProjectsSelectors.selectProjectIdByRouteParams)
  private _projectFromRoute$ = this.store.select(ProjectsSelectors.selectProjectByRouteParams)
  // projectFromRoute = firstValueFrom(this.store.select(ProjectsSelectors.selectProjectByRouteParams))
  localProject$ = this.store.select(ProjectsSelectors.selectLocalProject)

  init() {
    this.store.dispatch(ProjectsActions.initProjects())
  }

  get currentProjectId() {
    return firstValueFrom(this.currentProjectId$)
  }

  get projectFromRoute() {
    return firstValueFrom(this._projectFromRoute$)
  }

  initSelectProject(projectId: number) {
    this.store.dispatch(ProjectsActions.initSelectProject({ projectId }))
  }

  initLocalProject() {
    const storage = localStorage.getItem('slreng-prj')
    console.log(storage)
    if (storage) {
      const localProject: LocalProjectModel = JSON.parse(storage)

      return this.store.dispatch(ProjectsActions.initLocalProject({ localProject }))
    }
    const localProject: LocalProjectModel = {
      project: {
        id: 0,
        name: 'localProject',
        createdAt: new Date().getDate().toString(),
        createdBy: 0,
      },
      strings: [],
      panels: [],
      links: [],
    }
    return this.store.dispatch(ProjectsActions.initLocalProject({ localProject }))
  }
}
