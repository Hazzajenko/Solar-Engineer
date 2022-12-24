import { inject, Injectable } from '@angular/core'
import { ComponentStore } from '@ngrx/component-store'
import { ProjectsService } from '@projects/data-access/api'
import { ProjectModel } from '@shared/data-access/models'

interface ProjectState {
  project?: ProjectModel
}

@Injectable()
export class ProjectStore extends ComponentStore<ProjectState> {
  selectedProject$ = this.select((state) => state.project)
  private projectsService = inject(ProjectsService)

  /*
    readonly userProjects$ = this.select((state) => state.userProjects).pipe(
      switchMap((userProjects) => {
        if (userProjects) {
          return of(userProjects)
        }
        return this.projectsService.getUserProjects().pipe(
          tap((res) => {
            this.patchState({ userProjects: res })
          }),
        )
      }),
    )
    readonly getUserProjects = this.effect(() =>
      this.projectsService.getUserProjects().pipe(
        tapResponse(
          (projects) => this.patchState({ userProjects: projects }),
          (error: HttpErrorResponse) => console.error(error),
        ),
      ),
    )
    readonly getProjectById = this.effect((projectId$: Observable<number>) =>
      projectId$.pipe(
        switchMap((req) =>
          this.projectsService.getProjectById(req).pipe(
            tapResponse(
              (project) => this.patchState({ selectedProject: project }),
              (error: HttpErrorResponse) => console.error(error),
            ),
          ),
        ),
      ),
    )*/

  constructor() {
    super({
      project: undefined,
    })
  }
}
