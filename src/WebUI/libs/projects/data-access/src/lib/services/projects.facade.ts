import { inject, Injectable } from '@angular/core'
import { Store } from '@ngrx/store'
import { ProjectsSelectors } from '../store'
import { combineLatest, firstValueFrom } from 'rxjs'
import { throwExpression } from '@shared/utils'

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
  selectedProject$ = this.store.select(ProjectsSelectors.selectSelectedProject)
  selectIsWebProject$ = this.store.select(ProjectsSelectors.selectIsWebProject)
  projectFromRouteId$ = this.store.select(ProjectsSelectors.selectProjectIdByRouteParams)
  _projectFromRoute$ = this.store.select(ProjectsSelectors.selectProjectByRouteParams)
  // projectFromRoute = firstValueFrom(this.store.select(ProjectsSelectors.selectProjectByRouteParams))
  localProject$ = this.store.select(ProjectsSelectors.selectLocalProject)

  isWebWithProject$ = combineLatest([
    this.store.select(ProjectsSelectors.selectIsWebProject),
    this.store.select(ProjectsSelectors.selectProjectByRouteParams),
  ])

  async selectedProject() {
    return await firstValueFrom(this.selectedProjects$) ?? throwExpression('No project selected')
  }

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
