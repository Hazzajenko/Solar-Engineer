import { ComponentStore } from '@ngrx/component-store'
import { inject, Injectable } from '@angular/core'
import { combineLatestWith, EMPTY, Observable, of, switchMap, tap } from 'rxjs'
import { map } from 'rxjs/operators'
import { ProjectModel } from '../../shared/models/projects/project.model'
import { ProjectsService } from './projects.service'

interface ProjectState {
  userProjects?: ProjectModel[]
  selectedProject?: ProjectModel
}

@Injectable()
export class ProjectsStore extends ComponentStore<ProjectState> {
  selectedProject$ = this.select((state) => state.selectedProject)
  private projectsService = inject(ProjectsService)


  readonly userProjects$ = this.select((state) => state.userProjects).pipe(
    switchMap((userProjects) => {
      if (userProjects) {
        return of(userProjects)
      }
      return this.projectsService.getUserProjects().pipe(
        tap((res) => {
          // this.patchState({ userProjects: res })
        }),
      )
    }),
  )
  readonly getProjectById = this.effect((projectId$: Observable<number>) =>
    projectId$.pipe(
      map((params) => params),
      switchMap((req) => this.projectsService.getProjectById(req).pipe(
        // tap(res => this.patchState({selectedProject: res}))
      )),
    ),
  )

  constructor() {
    super({
      userProjects: undefined,
      selectedProject: undefined,
    })
  }
}
