import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { ProjectModel } from '@shared/data-access/models'
import { EMPTY, Observable } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { GetProjectByIdResponse } from './get-project-by-id.response'
import { GetProjectsResponse } from './get-projects.response'

@Injectable({
  providedIn: 'root',
})
export class ProjectsService {
  private http = inject(HttpClient)
  private version = 2

  getProjectById(projectId: number): Observable<GetProjectByIdResponse> {
    return this.http.get<GetProjectByIdResponse>(`/projects-api/projects/${projectId}`).pipe(
      catchError((err) => {
        console.log(err)
        return EMPTY
      }),
      map((res: GetProjectByIdResponse) => res),
    )
  }

  createWebProject(projectName: string): Observable<ProjectModel> {
    return this.http
      .post<ProjectModel>(`/projects-api/projects`, {
        name: projectName,
      })
      .pipe(map((res: ProjectModel) => res))
  }

  getUserProjects(): Observable<ProjectModel[]> {
    return this.http.get<GetProjectsResponse>('/projects-api/projects').pipe(
      catchError((err) => {
        console.log(err)
        return EMPTY
      }),
      map((res: GetProjectsResponse) => res.projects),
    )
  }

  getLocalProject(): Observable<ProjectModel[]> {
    return this.http.get<GetProjectsResponse>('/projects-api/projects').pipe(
      catchError((err) => {
        console.log(err)
        return EMPTY
      }),
      map((res: GetProjectsResponse) => res.projects),
    )
  }
}
