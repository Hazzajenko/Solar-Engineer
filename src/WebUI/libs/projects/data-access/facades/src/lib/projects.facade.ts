import { inject, Injectable } from '@angular/core'
import { Store } from '@ngrx/store'
import { ProjectsSelectors } from '@projects/data-access/store'
import { combineLatest, firstValueFrom } from 'rxjs'

@Injectable({ providedIn: 'root' })
export class ProjectsFacade {
  private store = inject(Store)
  loaded$ = this.store.select(ProjectsSelectors.selectProjectsLoaded)
  allProjects$ = this.store.select(ProjectsSelectors.selectAllProjects)
  selectedProjects$ = this.store.select(ProjectsSelectors.selectEntity)
  projectFromRoute$ = this.store.select(ProjectsSelectors.selectProjectByRouteParams)
  projectNameFromRoute$ = this.store.select(ProjectsSelectors.selectProjectByNameRouteParams)
  currentProjectId$ = this.store.select(ProjectsSelectors.selectProjectIdByRouteParams)
  selectedProjectId$ = this.store.select(ProjectsSelectors.selectSelectedProjectId)
  selectIsWebProject$ = this.store.select(ProjectsSelectors.selectIsWebProject)
  projectFromRouteId$ = this.store.select(ProjectsSelectors.selectProjectIdByRouteParams)
  _projectFromRoute$ = this.store.select(ProjectsSelectors.selectProjectByRouteParams)
  // projectFromRoute = firstValueFrom(this.store.select(ProjectsSelectors.selectProjectByRouteParams))
  localProject$ = this.store.select(ProjectsSelectors.selectLocalProject)

  isWebWithProject$ = combineLatest([
    this.store.select(ProjectsSelectors.selectIsWebProject),
    this.store.select(ProjectsSelectors.selectProjectByRouteParams)
  ])


  get currentProjectId() {
    return firstValueFrom(this.currentProjectId$)
  }

  get selectIsWebProject() {
    return firstValueFrom(this.selectIsWebProject$)
  }

  get projectFromRoute() {
    return firstValueFrom(this._projectFromRoute$)
  }
}
