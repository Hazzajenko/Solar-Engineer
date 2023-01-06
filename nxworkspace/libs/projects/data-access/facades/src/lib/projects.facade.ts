import { inject, Injectable } from '@angular/core'
import { Store } from '@ngrx/store'
import { ProjectsSelectors } from '@projects/data-access/store'
import { firstValueFrom } from 'rxjs'

@Injectable({ providedIn: 'root' })
export class ProjectsFacade {
  private store = inject(Store)
  loaded$ = this.store.select(ProjectsSelectors.selectProjectsLoaded)
  allProjects$ = this.store.select(ProjectsSelectors.selectAllProjects)
  selectedProjects$ = this.store.select(ProjectsSelectors.selectEntity)
  projectFromRoute$ = this.store.select(ProjectsSelectors.selectProjectByRouteParams)
  currentProjectId$ = this.store.select(ProjectsSelectors.selectProjectIdByRouteParams)
  projectFromRouteId$ = this.store.select(ProjectsSelectors.selectProjectIdByRouteParams)
  _projectFromRoute$ = this.store.select(ProjectsSelectors.selectProjectByRouteParams)
  // projectFromRoute = firstValueFrom(this.store.select(ProjectsSelectors.selectProjectByRouteParams))
  localProject$ = this.store.select(ProjectsSelectors.selectLocalProject)


  get currentProjectId() {
    return firstValueFrom(this.currentProjectId$)
  }

  get projectFromRoute() {
    return firstValueFrom(this._projectFromRoute$)
  }
}
