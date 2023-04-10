import { inject, Injectable } from '@angular/core'
import { Store } from '@ngrx/store'
import { ProjectsSelectors } from '../../store'
import { combineLatest, firstValueFrom } from 'rxjs'
import { map } from 'rxjs/operators'
import { ProjectModel } from '@shared/data-access/models'

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

  selectedProjectNoNull$() {
    /*    return this.selectedProject$.pipe(
     map((project) => project ?? throwError(() => new Error('No project selected'))),
     catchError((err) => EMPTY),
     )*/
    // return this.selectedProject$.pipe(filter((project): project is ProjectModel => !!project))
    // return this.selectedProject$.pipe(filter((project) => project is ProjectModel => !!project))
    return this.selectedProject$.pipe(map((project) => project))
  }

  async selectedProject() {
    return (await firstValueFrom(this.selectedProjects$)) ?? new ProjectModel({
      name:             'No project selected',
      createdById:      '1',
      createdTime:      Date.now()
                          .toString(),
      lastModifiedTime: Date.now()
                          .toString(),
    })
    // return (await firstValueFrom(this.selectedProjects$)) ?? throwExpression('No project selected')
    // return (await firstValueFrom(this.selectedProjects$)) ?? throwExpression('No project selected')
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
