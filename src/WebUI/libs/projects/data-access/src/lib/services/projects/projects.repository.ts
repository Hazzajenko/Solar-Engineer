import { LocalProjectModel, ProjectModel } from '@shared/data-access/models'
import { inject, Injectable } from '@angular/core'
import { Store } from '@ngrx/store'
import { ProjectsActions } from '../../store'

@Injectable({ providedIn: 'root' })
export class ProjectsRepository {
  private store = inject(Store)

  // private projects = inject(Store)

  init() {
    this.store.dispatch(ProjectsActions.initProjects())
  }

  addManyProjects(projects: ProjectModel[]) {
    this.store.dispatch(ProjectsActions.addManyProjects({ projects }))
  }

  initSelectProject(projectId: string) {
    this.store.dispatch(ProjectsActions.initSelectProject({ projectId }))
  }

  getProjectData() {
    this.store.dispatch(ProjectsActions.getProjectData())
  }

  createWebProject(projectName: string) {
    this.store.dispatch(ProjectsActions.createWebProject({ projectName }))
  }

  selectWebProject(projectId: string) {
    this.store.dispatch(ProjectsActions.initSelectProject({ projectId }))
  }

  initLocalProject() {
    const storage = localStorage.getItem('slreng-prj')
    // console.log(storage)
    if (storage) {
      const localProject: LocalProjectModel = JSON.parse(storage)

      return this.store.dispatch(ProjectsActions.initLocalProject({ localProject }))
    }
    const localProject: LocalProjectModel = {
      project: {
        id: '0',
        name: 'localProject',
        createdTime: new Date().getDate().toString(),
        createdById: '0',
        lastModifiedTime: new Date().getDate().toString(),
      },
      strings: [],
      panels: [],
      links: [],
    }
    return this.store.dispatch(ProjectsActions.initLocalProject({ localProject }))
  }
}
